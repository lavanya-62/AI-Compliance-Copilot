const express = require("express");
const db = require("../config/db");

const router = express.Router();

// =====================================
// GET REPORTS FOR USER
// =====================================

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    
    const documentSql = `
      SELECT
        id,
        original_name,
        risk_score,
        analysis_status,
        uploaded_at
      FROM documents
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
    `;

    const [documents] = await db
      .promise()
      .execute(documentSql, [userId]);

    
    for (const document of documents) {
      const findingSql = `
        SELECT
          issue,
          severity,
          recommendation
        FROM compliance_findings
        WHERE document_id = ?
        ORDER BY id ASC
      `;

      const [findings] = await db
        .promise()
        .execute(findingSql, [document.id]);

      document.findings = findings;

      
      if (document.risk_score < 50) {
        document.risk_level = "High";
      } else if (document.risk_score < 75) {
        document.risk_level = "Medium";
      } else {
        document.risk_level = "Low";
      }
    }

    res.json({
      success: true,
      reports: documents,
    });

  } catch (error) {
    console.error(
      "Reports error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});

// =====================================
// DASHBOARD DATA
// =====================================

router.get("/dashboard/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  
  const latestDocumentSql = `
    SELECT
      d.id,
      d.original_name,
      d.risk_score,
      d.analysis_status,
      d.uploaded_at,

      COUNT(cf.id) AS total_findings,

      SUM(
        CASE
          WHEN cf.severity = 'High' THEN 1
          ELSE 0
        END
      ) AS high_risk,

      SUM(
        CASE
          WHEN cf.severity = 'Medium' THEN 1
          ELSE 0
        END
      ) AS medium_risk,

      SUM(
        CASE
          WHEN cf.severity = 'Low' THEN 1
          ELSE 0
        END
      ) AS low_risk

    FROM documents d

    LEFT JOIN compliance_findings cf
      ON d.id = cf.document_id

    WHERE d.user_id = ?

    GROUP BY
      d.id,
      d.original_name,
      d.risk_score,
      d.analysis_status,
      d.uploaded_at

    ORDER BY d.uploaded_at DESC, d.id DESC

    LIMIT 1
  `;

  db.query(
    latestDocumentSql,
    [userId],
    (err, latestResults) => {
      if (err) {
        console.error(
          "Dashboard latest document error:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch dashboard data",
        });
      }

      
      if (latestResults.length === 0) {
        return res.json({
          documentsChecked: 0,
          latestDocument: null,
          complianceScore: 0,
          riskLevel: "No Data",
          totalFindings: 0,
          highRisk: 0,
          mediumRisk: 0,
          lowRisk: 0,
          findings: [],
        });
      }

      const latest = latestResults[0];

      
      const countSql = `
        SELECT COUNT(*) AS total
        FROM documents
        WHERE user_id = ?
      `;

      db.query(
        countSql,
        [userId],
        (countErr, countResults) => {
          if (countErr) {
            console.error(
              "Dashboard document count error:",
              countErr
            );

            return res.status(500).json({
              message:
                "Failed to count documents",
            });
          }

          
          const findingsSql = `
            SELECT
              issue,
              severity,
              recommendation
            FROM compliance_findings
            WHERE document_id = ?
            ORDER BY id ASC
          `;

          db.query(
            findingsSql,
            [latest.id],
            (findingsErr, findingsResults) => {
              if (findingsErr) {
                console.error(
                  "Dashboard findings error:",
                  findingsErr
                );

                return res.status(500).json({
                  message:
                    "Failed to fetch findings",
                });
              }

              const complianceScore =
                Number(latest.risk_score) || 0;

              let riskLevel = "Low";

              if (complianceScore < 50) {
                riskLevel = "High";
              } else if (complianceScore < 75) {
                riskLevel = "Medium";
              }

              res.json({
                documentsChecked:
                  Number(countResults[0].total),

                latestDocument: {
                  id: latest.id,
                  name: latest.original_name,
                  score: complianceScore,
                  status: latest.analysis_status,
                  uploadedAt: latest.uploaded_at,
                },

                complianceScore,

                riskLevel,

                totalFindings:
                  Number(latest.total_findings) || 0,

                highRisk:
                  Number(latest.high_risk) || 0,

                mediumRisk:
                  Number(latest.medium_risk) || 0,

                lowRisk:
                  Number(latest.low_risk) || 0,

                findings: findingsResults,
              });
            }
          );
        }
      );
    }
  );
});


// =====================================
// DOWNLOAD REPORT AS PDF
// =====================================

const PDFDocument = require("pdfkit");

router.get("/:userId/:documentId/pdf", async (req, res) => {
  try {
    const { userId, documentId } = req.params;

    if (!userId || !documentId) {
      return res.status(400).json({
        message: "User ID and Document ID are required",
      });
    }

    // --------------------------------
    // GET DOCUMENT
    // --------------------------------

    const documentSql = `
      SELECT
        id,
        user_id,
        original_name,
        risk_score,
        analysis_status,
        uploaded_at
      FROM documents
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;

    const [documents] = await db
      .promise()
      .execute(documentSql, [
        documentId,
        userId,
      ]);

    if (documents.length === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const report = documents[0];

    // --------------------------------
    // GET FINDINGS
    // --------------------------------

    const findingsSql = `
      SELECT
        issue,
        severity,
        recommendation
      FROM compliance_findings
      WHERE document_id = ?
      ORDER BY id ASC
    `;

    const [findings] = await db
      .promise()
      .execute(findingsSql, [documentId]);

    // --------------------------------
    // CALCULATE RISK LEVEL
    // --------------------------------

    const score = Number(report.risk_score) || 0;

    let riskLevel = "Low";

    if (score < 50) {
      riskLevel = "High";
    } else if (score < 75) {
      riskLevel = "Medium";
    }

    // --------------------------------
    // FINDING COUNTS
    // --------------------------------

    const highRisk = findings.filter(
      (item) => item.severity === "High"
    ).length;

    const mediumRisk = findings.filter(
      (item) => item.severity === "Medium"
    ).length;

    const lowRisk = findings.filter(
      (item) => item.severity === "Low"
    ).length;

    // --------------------------------
    // PDF RESPONSE
    // --------------------------------

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Compliance_Report_${report.id}.pdf"`
    );

    const pdf = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    pdf.pipe(res);

    // =================================
    // PDF HEADER
    // =================================

    pdf
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("AI COMPLIANCE COPILOT", {
        align: "center",
      });

    pdf
      .moveDown(0.5)
      .fontSize(16)
      .font("Helvetica")
      .text("MSME Compliance Report", {
        align: "center",
      });

    pdf.moveDown(1);

    // =================================
    // DOCUMENT INFORMATION
    // =================================

    pdf
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Document Information");

    pdf.moveDown(0.5);

    pdf
      .font("Helvetica")
      .text(`Document: ${report.original_name}`)
      .text(
        `Analysis Status: ${report.analysis_status}`
      )
      .text(
        `Uploaded: ${new Date(
          report.uploaded_at
        ).toLocaleString()}`
      );

    pdf.moveDown(1);

    // =================================
    // SCORE
    // =================================

    pdf
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Compliance Summary");

    pdf.moveDown(0.5);

    pdf
      .fontSize(12)
      .font("Helvetica")
      .text(`Compliance Score: ${score}%`)
      .text(`Risk Level: ${riskLevel}`)
      .text(`Total Findings: ${findings.length}`)
      .text(`High Risk: ${highRisk}`)
      .text(`Medium Risk: ${mediumRisk}`)
      .text(`Low Risk: ${lowRisk}`);

    pdf.moveDown(1);

    // =================================
    // FINDINGS
    // =================================

    pdf
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Compliance Findings");

    pdf.moveDown(0.5);

    if (findings.length === 0) {

      pdf
        .fontSize(12)
        .font("Helvetica")
        .text(
          "No compliance issues detected."
        );

    } else {

      findings.forEach((finding, index) => {

        pdf
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(
            `${index + 1}. ${finding.issue}`
          );

        pdf
          .font("Helvetica")
          .text(
            `Severity: ${finding.severity}`
          );

        pdf
          .font("Helvetica")
          .text(
            `Recommendation: ${finding.recommendation}`
          );

        pdf.moveDown(0.8);
      });
    }

    // =================================
    // FOOTER
    // =================================

    pdf.moveDown(1);

    pdf
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Generated by AI Compliance Copilot for MSMEs",
        {
          align: "center",
        }
      );

    pdf.end();

  } catch (error) {

    console.error(
      "PDF generation error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        message:
          "Failed to generate compliance report",
      });
    }
  }
});
module.exports = router;

