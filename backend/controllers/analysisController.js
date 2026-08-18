const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const db = require("../config/db");

// =====================================
// PDF TEXT EXTRACTION
// =====================================

async function extractPdfText(filePath) {
  const pdfjsLib = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  );

  const data = new Uint8Array(
    fs.readFileSync(filePath)
  );

  const loadingTask = pdfjsLib.getDocument({
    data,
  });

  const pdf = await loadingTask.promise;

  let text = "";

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page = await pdf.getPage(pageNumber);

    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str || "")
      .join(" ");

    text += pageText + "\n";
  }

  return text;
}

// =====================================
// TEXT NORMALIZATION
// =====================================

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================
// CHECK WHETHER ANY KEYWORD EXISTS
// =====================================

function containsAny(text, keywords) {
  return keywords.some((keyword) =>
    text.includes(keyword)
  );
}

// =====================================
// ANALYZE DOCUMENT
// =====================================

async function analyzeDocument(req, res) {
  try {
    console.log("====================================");
    console.log("📄 DOCUMENT ANALYSIS STARTED");
    console.log("====================================");

    // =================================
    // 1. CHECK FILE
    // =================================

    if (!req.file) {
      return res.status(400).json({
        message: "No document provided",
      });
    }

    console.log(
      "📄 File:",
      req.file.originalname
    );

    // =================================
    // 2. USER ID
    // =================================

    const userId = req.body.userId || 1;

    console.log(
      "👤 User ID:",
      userId
    );

    // =================================
    // 3. FILE INFORMATION
    // =================================

    const filePath = req.file.path;

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    let text = "";

    // =================================
    // 4. EXTRACT PDF TEXT
    // =================================

    if (extension === ".pdf") {
      console.log("📕 Reading PDF...");

      text = await extractPdfText(
        filePath
      );
    }

    // =================================
    // 5. EXTRACT DOCX TEXT
    // =================================

    else if (extension === ".docx") {
      console.log("📘 Reading DOCX...");

      const result =
        await mammoth.extractRawText({
          path: filePath,
        });

      text = result.value;
    }

    // =================================
    // 6. UNSUPPORTED FILE
    // =================================

    else {
      return res.status(400).json({
        message:
          "Only PDF and DOCX files are supported.",
      });
    }

    // =================================
    // 7. CHECK EXTRACTED TEXT
    // =================================

    if (!text || !text.trim()) {
      return res.status(400).json({
        message:
          "Could not extract text from this document.",
      });
    }

    console.log(
      "📝 Characters extracted:",
      text.length
    );

    // =================================
    // 8. NORMALIZE TEXT
    // =================================

    const normalizedText =
      normalizeText(text);

    console.log(
      "📝 Normalized text:"
    );

    console.log(
      normalizedText.substring(0, 2000)
    );

    // =================================
    // 9. COMPLIANCE FINDINGS
    // =================================

    const findings = [];

    // =================================
    // GST
    // =================================

    const hasGST = containsAny(
      normalizedText,
      [
        "gst",
        "gstin",
        "gst registration",
        "goods and services tax",
      ]
    );

    console.log(
      "GST detected:",
      hasGST
    );

    if (!hasGST) {
      findings.push({
        issue:
          "GST information not detected",

        severity:
          "Medium",

        recommendation:
          "Verify GST registration and filing information.",
      });
    }

    // =================================
    // PAN
    // =================================

    const hasPAN = containsAny(
      normalizedText,
      [
        "pan",
        "pan card",
        "permanent account number",
      ]
    );

    console.log(
      "PAN detected:",
      hasPAN
    );

    if (!hasPAN) {
      findings.push({
        issue:
          "PAN information not detected",

        severity:
          "Medium",

        recommendation:
          "Verify that the business PAN information is available and valid.",
      });
    }

    // =================================
    // BUSINESS LICENSE
    // =================================

    const hasLicense =
      normalizedText.includes("license") ||
      normalizedText.includes("licence") ||
      normalizedText.includes(
        "business license"
      ) ||
      normalizedText.includes(
        "business licence"
      );

    console.log(
      "Business License detected:",
      hasLicense
    );

    if (!hasLicense) {
      findings.push({
        issue:
          "Business license information not detected",

        severity:
          "Medium",

        recommendation:
          "Verify that the required business license is valid.",
      });
    }

    // =================================
    // BUSINESS REGISTRATION
    // =================================

    const hasBusinessRegistration =
      containsAny(
        normalizedText,
        [
          "business registration",
          "company registration",
          "company registered",
          "business registered",
          "incorporation",
          "cin",
        ]
      );

    console.log(
      "Business Registration detected:",
      hasBusinessRegistration
    );

    if (!hasBusinessRegistration) {
      findings.push({
        issue:
          "Business registration information not detected",

        severity:
          "Medium",

        recommendation:
          "Verify that the business registration or incorporation information is available.",
      });
    }

    // =================================
    // INCOME TAX
    // =================================

    const hasIncomeTax =
      containsAny(
        normalizedText,
        [
          "income tax",
          "income-tax",
          "itr",
          "tax filing",
          "tax return",
        ]
      );

    console.log(
      "Income Tax detected:",
      hasIncomeTax
    );

    if (!hasIncomeTax) {
      findings.push({
        issue:
          "Income tax information not detected",

        severity:
          "Medium",

        recommendation:
          "Verify applicable income-tax registration and filing requirements.",
      });
    }

    // =================================
    // INVOICE / BILLING
    // =================================

    const hasInvoice =
      containsAny(
        normalizedText,
        [
          "invoice",
          "invoices",
          "billing",
          "bill",
          "billing records",
        ]
      );

    console.log(
      "Invoice detected:",
      hasInvoice
    );

    if (!hasInvoice) {
      findings.push({
        issue:
          "Invoice or billing information not detected",

        severity:
          "Low",

        recommendation:
          "Verify that business invoices contain the required information.",
      });
    }

    // =================================
    // PRIVACY POLICY
    // =================================

    const hasPrivacy =
      containsAny(
        normalizedText,
        [
          "privacy",
          "privacy policy",
          "privacy notice",
        ]
      );

    console.log(
      "Privacy Policy detected:",
      hasPrivacy
    );

    if (!hasPrivacy) {
      findings.push({
        issue:
          "Privacy policy information not detected",

        severity:
          "Low",

        recommendation:
          "Review whether your business requires a privacy policy.",
      });
    }

    // =================================
    // DATA PROTECTION
    // =================================

    const hasDataProtection =
      containsAny(
        normalizedText,
        [
          "data protection",
          "data security",
          "personal data",
          "data privacy",
          "information security",
        ]
      );

    console.log(
      "Data Protection detected:",
      hasDataProtection
    );

    if (!hasDataProtection) {
      findings.push({
        issue:
          "Data protection information not detected",

        severity:
          "Low",

        recommendation:
          "Review how personal and business data is collected, stored, and protected.",
      });
    }

    // =================================
    // EMPLOYEE / LABOUR
    // =================================

    const hasEmployeeCompliance =
      containsAny(
        normalizedText,
        [
          "employee",
          "employees",
          "labour",
          "labor",
          "payroll",
          "employment",
        ]
      );

    console.log(
      "Employee/Labour detected:",
      hasEmployeeCompliance
    );

    if (!hasEmployeeCompliance) {
      findings.push({
        issue:
          "Employee or labour compliance information not detected",

        severity:
          "Low",

        recommendation:
          "Review applicable employee, payroll, and labour compliance requirements.",
      });
    }

    // =================================
    // ANNUAL FILING
    // =================================

    const hasAnnualFiling =
      containsAny(
        normalizedText,
        [
          "annual filing",
          "annual return",
          "annual report",
          "annual compliance",
        ]
      );

    console.log(
      "Annual Filing detected:",
      hasAnnualFiling
    );

    if (!hasAnnualFiling) {
      findings.push({
        issue:
          "Annual filing information not detected",

        severity:
          "Low",

        recommendation:
          "Verify applicable annual filing and reporting requirements.",
      });
    }

    // =================================
    // 10. CALCULATE COMPLIANCE SCORE
    // =================================

    let complianceScore = 100;

    findings.forEach(
      (finding) => {
        if (
          finding.severity ===
          "High"
        ) {
          complianceScore -= 25;
        }

        else if (
          finding.severity ===
          "Medium"
        ) {
          complianceScore -= 15;
        }

        else if (
          finding.severity ===
          "Low"
        ) {
          complianceScore -= 5;
        }
      }
    );

    if (complianceScore < 0) {
      complianceScore = 0;
    }

    if (complianceScore > 100) {
      complianceScore = 100;
    }

    // =================================
    // 11. DETERMINE RISK LEVEL
    // =================================

    let riskLevel = "Low";

    if (complianceScore < 50) {
      riskLevel = "High";
    }

    else if (
      complianceScore < 75
    ) {
      riskLevel = "Medium";
    }

    else {
      riskLevel = "Low";
    }

    // =================================
    // 12. FINDING COUNTS
    // =================================

    const highRisk =
      findings.filter(
        (f) =>
          f.severity === "High"
      ).length;

    const mediumRisk =
      findings.filter(
        (f) =>
          f.severity === "Medium"
      ).length;

    const lowRisk =
      findings.filter(
        (f) =>
          f.severity === "Low"
      ).length;

    console.log(
      "===================================="
    );

    console.log(
      "📊 COMPLIANCE RESULT"
    );

    console.log(
      "Score:",
      complianceScore
    );

    console.log(
      "Risk Level:",
      riskLevel
    );

    console.log(
      "Total Findings:",
      findings.length
    );

    console.log(
      "High:",
      highRisk
    );

    console.log(
      "Medium:",
      mediumRisk
    );

    console.log(
      "Low:",
      lowRisk
    );

    console.log(
      "===================================="
    );

    // =================================
    // 13. SAVE DOCUMENT
    // =================================

    const documentSql = `
      INSERT INTO documents
      (
        user_id,
        original_name,
        stored_name,
        file_path,
        risk_score,
        analysis_status
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [
      documentResult,
    ] = await db
      .promise()
      .execute(
        documentSql,
        [
          userId,
          req.file.originalname,
          req.file.filename,
          req.file.path,

          // Keep database column name
          // "risk_score" for compatibility.
          // Value represents COMPLIANCE SCORE.
          complianceScore,

          "Completed",
        ]
      );

    const documentId =
      documentResult.insertId;

    console.log(
      "💾 Document saved:",
      documentId
    );

    // =================================
    // 14. SAVE FINDINGS
    // =================================

    for (
      const finding of findings
    ) {
      const findingSql = `
        INSERT INTO compliance_findings
        (
          document_id,
          issue,
          severity,
          recommendation
        )
        VALUES (?, ?, ?, ?)
      `;

      await db
        .promise()
        .execute(
          findingSql,
          [
            documentId,
            finding.issue,
            finding.severity,
            finding.recommendation,
          ]
        );
    }

    console.log(
      "💾 Findings saved:",
      findings.length
    );

    // =================================
    // 15. SEND RESPONSE
    // =================================

    const responseData = {
      success: true,

      message:
        "Document analyzed and saved successfully",

      documentId,

      document:
        req.file.originalname,

      // Main score
      riskScore:
        complianceScore,

      // Clear name for frontend
      complianceScore,

      riskLevel,

      totalFindings:
        findings.length,

      highRisk,

      mediumRisk,

      lowRisk,

      findings,

      extractedCharacters:
        text.length,

      extractedText:
        text.substring(0, 2000),
    };

    console.log(
      "✅ Analysis completed successfully"
    );

    return res.json(
      responseData
    );

  } catch (error) {
    console.error(
      "❌ ANALYSIS ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        "Document analysis failed",

      error:
        error.message,
    });
  }
}

// =====================================
// EXPORT
// =====================================

module.exports = {
  analyzeDocument,
};