
import React, {
  createContext,
  useContext,
  useState,
} from "react";


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

  /* =======================================================
     ENGLISH
  ======================================================= */

  English: {

    /* COMMON */

    home: "HOME",
    overview: "Overview",
    dashboard: "Dashboard",
    schemes: "Schemes",
    districts: "Districts",
    anomalies: "Anomalies",
    recommendations: "Recommendations",

    language: "Language",

    governanceIntelligence:
      "GOVERNANCE INTELLIGENCE",

    aiSystemOnline:
      "AI SYSTEM ONLINE",

    dataStatus:
      "DATA STATUS",

    dataConnected:
      "Data Connected",

    janSetuVersion:
      "JanSetu AI v1.0",

    dataStatusLive:
      "LIVE",

    noData:
      "No data available",

    error:
      "Error",

    success:
      "Success",


    /* DASHBOARD */

    intelligence:
      "AI Intelligence Overview",

    intelligenceSubtitle:
      "Key signals generated from governance datasets",

    janSetuIntelligence:
      "JANSETU INTELLIGENCE",

    mainTitle:
      "From Government Data to Actionable Insights",

    mainDescription:
      "JanSetu AI analyzes scheme performance, beneficiary coverage, resource utilization, geographic gaps, anomalies and scheme overlaps to support better implementation decisions.",

    activeSchemes:
      "Active Schemes",

    districtsAnalyzed:
      "Districts Analyzed",

    coverage:
      "Beneficiary Coverage",

    performance:
      "Scheme Performance",

    geographicGaps:
      "Geographic Gaps",

    overlaps:
      "Scheme Overlaps",

    resources:
      "Resource Utilization",

    coverageDescription:
      "Monitor beneficiary reach across government schemes.",

    anomaliesDescription:
      "AI-detected implementation signals requiring attention.",

    geographicDescription:
      "Identify districts with service delivery gaps.",

    overlapsDescription:
      "Detect overlapping schemes and departments.",

    viewAnalysis:
      "View analysis",

    priorityAttention:
      "Priority Attention",

    prioritySubtitle:
      "AI-generated signals requiring administrative review",


    /* PRIORITY */

    highPriority:
      "HIGH",

    mediumPriority:
      "MEDIUM",

    lowPriority:
      "LOW",

    district:
      "District",

    scheme:
      "Scheme",

    signal:
      "Signal",

    lowCoverage:
      "Low beneficiary coverage",

    coverageOutcomeGap:
      "Coverage & outcome gap",

    lowResourceUtilization:
      "Low resource utilization",


    /* SCHEMES */

    governmentSchemes:
      "Government Schemes",

    schemeDescription:
      "AI-powered monitoring of beneficiary coverage across government schemes.",

    coverageRecords:
      "Coverage Records",

    loadingCoverage:
      "Loading coverage data...",

    unableCoverage:
      "Unable to load coverage data.",

    backendConnection:
      "Unable to connect to JanSetu AI backend.",

    retry:
      "Retry",

    targetBeneficiaries:
      "Target Beneficiaries",

    actualBeneficiaries:
      "Actual Beneficiaries",

    status:
      "Status",

    good:
      "Good",

    critical:
      "Critical",

    needsAttention:
      "Needs Attention",

    noCoverage:
      "No coverage records available.",


    /* ANOMALIES */

    anomaliesDetected:
      "Anomalies Detected",

    anomalyDescription:
      "AI-detected anomalies requiring administrative attention.",

    anomalyType:
      "Type",

    severity:
      "Severity",

    evidence:
      "Evidence",

    action:
      "Action",

    review:
      "Review",


    /* DISTRICTS */

    geographicGapAnalysis:
      "Geographic Gap Analysis",

    geographicGapDescription:
      "Identify districts with service delivery and implementation gaps.",

    population:
      "Population",

    ruralPopulation:
      "Rural Population",

    infrastructure:
      "Infrastructure Index",

    averageCoverage:
      "Average Coverage",

    schemesBelow50:
      "Schemes Below 50%",

    schemesAnalyzed:
      "Schemes Analyzed",

    gapLevel:
      "Gap Level",


    /* RECOMMENDATIONS */

    recommendationsTitle:
      "AI Recommendations",

    recommendationsDescription:
      "AI-generated actions based on scheme, district and implementation data.",

    priority:
      "Priority",

    actions:
      "Recommended Actions",

    evidenceLabel:
      "Evidence",

    schemeName:
      "Scheme Name",

    multipleSchemes:
      "Multiple Schemes",


    /* COMMON VALUES */

    high:
      "HIGH",

    medium:
      "MEDIUM",

    low:
      "LOW",

    schemeType:
      "SCHEME",

    geographicType:
      "GEOGRAPHIC",

  },


  /* =======================================================
     MARATHI
  ======================================================= */

  Marathi: {

    /* COMMON */

    home: "मुख्यपृष्ठ",
    overview: "आढावा",
    dashboard: "डॅशबोर्ड",
    schemes: "योजना",
    districts: "जिल्हे",
    anomalies: "विसंगती",
    recommendations: "शिफारसी",

    language: "भाषा",

    governanceIntelligence:
      "शासन बुद्धिमत्ता",

    aiSystemOnline:
      "AI प्रणाली कार्यरत",

    dataStatus:
      "डेटा स्थिती",

    dataConnected:
      "डेटा जोडलेला आहे",

    janSetuVersion:
      "जनसेतू AI v1.0",

    dataStatusLive:
      "थेट",

    noData:
      "डेटा उपलब्ध नाही",

    error:
      "त्रुटी",

    success:
      "यशस्वी",


    /* DASHBOARD */

    intelligence:
      "AI बुद्धिमत्ता आढावा",

    intelligenceSubtitle:
      "शासकीय डेटासेटमधून तयार झालेले महत्त्वाचे संकेत",

    janSetuIntelligence:
      "जनसेतू बुद्धिमत्ता",

    mainTitle:
      "शासकीय डेटापासून कृतीयोग्य माहितीपर्यंत",

    mainDescription:
      "जनसेतू AI योजना कामगिरी, लाभार्थी कव्हरेज, संसाधन वापर, भौगोलिक तफावत, विसंगती आणि योजनांमधील ओव्हरलॅपचे विश्लेषण करते, ज्यामुळे योजनांची अंमलबजावणी अधिक प्रभावीपणे करता येते.",

    activeSchemes:
      "सक्रिय योजना",

    districtsAnalyzed:
      "विश्लेषित जिल्हे",

    coverage:
      "लाभार्थी कव्हरेज",

    performance:
      "योजना कामगिरी",

    geographicGaps:
      "भौगोलिक तफावत",

    overlaps:
      "योजना ओव्हरलॅप",

    resources:
      "संसाधन वापर",

    coverageDescription:
      "विविध शासकीय योजनांमधील लाभार्थी पोहोच तपासा.",

    anomaliesDescription:
      "लक्ष देण्याची आवश्यकता असलेले AI-आधारित अंमलबजावणी संकेत.",

    geographicDescription:
      "सेवा वितरणातील तफावत असलेले जिल्हे ओळखा.",

    overlapsDescription:
      "एकमेकांशी संबंधित योजना आणि विभाग ओळखा.",

    viewAnalysis:
      "विश्लेषण पहा",

    priorityAttention:
      "प्राधान्याने लक्ष देण्याची बाब",

    prioritySubtitle:
      "प्रशासकीय पुनरावलोकनासाठी AI-आधारित संकेत",


    /* PRIORITY */

    highPriority:
      "उच्च",

    mediumPriority:
      "मध्यम",

    lowPriority:
      "कमी",

    district:
      "जिल्हा",

    scheme:
      "योजना",

    signal:
      "संकेत",

    lowCoverage:
      "कमी लाभार्थी कव्हरेज",

    coverageOutcomeGap:
      "कव्हरेज आणि परिणामातील तफावत",

    lowResourceUtilization:
      "कमी संसाधन वापर",


    /* SCHEMES */

    governmentSchemes:
      "शासकीय योजना",

    schemeDescription:
      "शासकीय योजनांमधील लाभार्थी कव्हरेजचे AI-आधारित निरीक्षण.",

    coverageRecords:
      "कव्हरेज नोंदी",

    loadingCoverage:
      "कव्हरेज डेटा लोड होत आहे...",

    unableCoverage:
      "कव्हरेज डेटा लोड करता आला नाही.",

    backendConnection:
      "JanSetu AI बॅकएंडशी कनेक्ट करता आले नाही.",

    retry:
      "पुन्हा प्रयत्न करा",

    targetBeneficiaries:
      "लक्ष्यित लाभार्थी",

    actualBeneficiaries:
      "प्रत्यक्ष लाभार्थी",

    status:
      "स्थिती",

    good:
      "चांगले",

    critical:
      "गंभीर",

    needsAttention:
      "लक्ष देणे आवश्यक",

    noCoverage:
      "कव्हरेज नोंदी उपलब्ध नाहीत.",


    /* ANOMALIES */

    anomaliesDetected:
      "विसंगती आढळल्या",

    anomalyDescription:
      "प्रशासकीय लक्ष देण्याची आवश्यकता असलेल्या AI-आधारित विसंगती.",

    anomalyType:
      "प्रकार",

    severity:
      "तीव्रता",

    evidence:
      "पुरावा",

    action:
      "कृती",

    review:
      "पुनरावलोकन",


    /* DISTRICTS */

    geographicGapAnalysis:
      "भौगोलिक तफावत विश्लेषण",

    geographicGapDescription:
      "सेवा वितरण आणि अंमलबजावणीतील तफावत असलेले जिल्हे ओळखा.",

    population:
      "लोकसंख्या",

    ruralPopulation:
      "ग्रामीण लोकसंख्या",

    infrastructure:
      "पायाभूत सुविधा निर्देशांक",

    averageCoverage:
      "सरासरी कव्हरेज",

    schemesBelow50:
      "५०% पेक्षा कमी असलेल्या योजना",

    schemesAnalyzed:
      "विश्लेषित योजना",

    gapLevel:
      "तफावत पातळी",


    /* RECOMMENDATIONS */

    recommendationsTitle:
      "AI शिफारसी",

    recommendationsDescription:
      "योजना, जिल्हा आणि अंमलबजावणी डेटावर आधारित AI-निर्मित कृती.",

    priority:
      "प्राधान्य",

    actions:
      "शिफारस केलेल्या कृती",

    evidenceLabel:
      "पुरावा",

    schemeName:
      "योजनेचे नाव",

    multipleSchemes:
      "अनेक योजना",


    /* COMMON VALUES */

    high:
      "उच्च",

    medium:
      "मध्यम",

    low:
      "कमी",

    schemeType:
      "योजना",

    geographicType:
      "भौगोलिक",

  },


  /* =======================================================
     HINDI
  ======================================================= */

  Hindi: {

    /* COMMON */

    home: "मुख्य पृष्ठ",
    overview: "अवलोकन",
    dashboard: "डैशबोर्ड",
    schemes: "योजनाएं",
    districts: "जिले",
    anomalies: "विसंगतियां",
    recommendations: "सिफारिशें",

    language: "भाषा",

    governanceIntelligence:
      "शासन बुद्धिमत्ता",

    aiSystemOnline:
      "AI प्रणाली सक्रिय",

    dataStatus:
      "डेटा स्थिति",

    dataConnected:
      "डेटा कनेक्टेड",

    janSetuVersion:
      "जनसेतू AI v1.0",

    dataStatusLive:
      "लाइव",

    noData:
      "डेटा उपलब्ध नहीं है",

    error:
      "त्रुटि",

    success:
      "सफल",


    /* DASHBOARD */

    intelligence:
      "AI बुद्धिमत्ता अवलोकन",

    intelligenceSubtitle:
      "सरकारी डेटासेट से तैयार किए गए महत्वपूर्ण संकेत",

    janSetuIntelligence:
      "जनसेतू बुद्धिमत्ता",

    mainTitle:
      "सरकारी डेटा से कार्रवाई योग्य जानकारी तक",

    mainDescription:
      "जनसेतू AI योजना प्रदर्शन, लाभार्थी कवरेज, संसाधन उपयोग, भौगोलिक अंतर, विसंगतियों और योजनाओं के ओवरलैप का विश्लेषण करता है ताकि योजनाओं के क्रियान्वयन को बेहतर बनाया जा सके।",

    activeSchemes:
      "सक्रिय योजनाएं",

    districtsAnalyzed:
      "विश्लेषित जिले",

    coverage:
      "लाभार्थी कवरेज",

    performance:
      "योजना प्रदर्शन",

    geographicGaps:
      "भौगोलिक अंतर",

    overlaps:
      "योजना ओवरलैप",

    resources:
      "संसाधन उपयोग",

    coverageDescription:
      "सरकारी योजनाओं में लाभार्थियों की पहुंच की निगरानी करें।",

    anomaliesDescription:
      "ध्यान देने योग्य AI-आधारित क्रियान्वयन संकेत।",

    geographicDescription:
      "सेवा वितरण में अंतर वाले जिलों की पहचान करें।",

    overlapsDescription:
      "आपस में जुड़ी योजनाओं और विभागों की पहचान करें।",

    viewAnalysis:
      "विश्लेषण देखें",

    priorityAttention:
      "प्राथमिकता से ध्यान देने योग्य",

    prioritySubtitle:
      "प्रशासकीय समीक्षा के लिए AI-आधारित संकेत",


    /* PRIORITY */

    highPriority:
      "उच्च",

    mediumPriority:
      "मध्यम",

    lowPriority:
      "कम",

    district:
      "जिला",

    scheme:
      "योजना",

    signal:
      "संकेत",

    lowCoverage:
      "कम लाभार्थी कवरेज",

    coverageOutcomeGap:
      "कवरेज और परिणाम में अंतर",

    lowResourceUtilization:
      "कम संसाधन उपयोग",


    /* SCHEMES */

    governmentSchemes:
      "सरकारी योजनाएं",

    schemeDescription:
      "सरकारी योजनाओं में लाभार्थी कवरेज की AI-आधारित निगरानी.",

    coverageRecords:
      "कवरेज रिकॉर्ड",

    loadingCoverage:
      "कवरेज डेटा लोड हो रहा है...",

    unableCoverage:
      "कवरेज डेटा लोड नहीं किया जा सका.",

    backendConnection:
      "JanSetu AI बैकएंड से कनेक्ट नहीं किया जा सका.",

    retry:
      "पुनः प्रयास करें",

    targetBeneficiaries:
      "लक्षित लाभार्थी",

    actualBeneficiaries:
      "वास्तविक लाभार्थी",

    status:
      "स्थिति",

    good:
      "अच्छा",

    critical:
      "गंभीर",

    needsAttention:
      "ध्यान आवश्यक",

    noCoverage:
      "कोई कवरेज रिकॉर्ड उपलब्ध नहीं है.",


    /* ANOMALIES */

    anomaliesDetected:
      "विसंगतियां पाई गईं",

    anomalyDescription:
      "प्रशासकीय ध्यान देने योग्य AI-आधारित विसंगतियां.",

    anomalyType:
      "प्रकार",

    severity:
      "गंभीरता",

    evidence:
      "प्रमाण",

    action:
      "कार्रवाई",

    review:
      "समीक्षा",


    /* DISTRICTS */

    geographicGapAnalysis:
      "भौगोलिक अंतर विश्लेषण",

    geographicGapDescription:
      "सेवा वितरण और क्रियान्वयन में अंतर वाले जिलों की पहचान करें।",

    population:
      "जनसंख्या",

    ruralPopulation:
      "ग्रामीण जनसंख्या",

    infrastructure:
      "बुनियादी ढांचा सूचकांक",

    averageCoverage:
      "औसत कवरेज",

    schemesBelow50:
      "५०% से कम कवरेज वाली योजनाएं",

    schemesAnalyzed:
      "विश्लेषित योजनाएं",

    gapLevel:
      "अंतर स्तर",


    /* RECOMMENDATIONS */

    recommendationsTitle:
      "AI सिफारिशें",

    recommendationsDescription:
      "योजना, जिला और क्रियान्वयन डेटा के आधार पर AI-निर्मित कार्रवाई.",

    priority:
      "प्राथमिकता",

    actions:
      "अनुशंसित कार्रवाइयां",

    evidenceLabel:
      "प्रमाण",

    schemeName:
      "योजना का नाम",

    multipleSchemes:
      "एकाधिक योजनाएं",


    /* COMMON VALUES */

    high:
      "उच्च",

    medium:
      "मध्यम",

    low:
      "कम",

    schemeType:
      "योजना",

    geographicType:
      "भौगोलिक",

  },

};


/* =========================================================
   LANGUAGE CONTEXT
========================================================= */

const LanguageContext = createContext(null);


/* =========================================================
   LANGUAGE PROVIDER
========================================================= */

export function LanguageProvider({ children }) {

  const [language, setLanguage] = useState("English");


  /*
     Translation function.

     Example:

     t("dashboard")

     returns:

     English -> Dashboard
     Marathi -> डॅशबोर्ड
     Hindi   -> डैशबोर्ड
  */

  const t = (key) => {

    const currentTranslations =
      translations[language] || translations.English;

    return (
      currentTranslations[key] ??
      translations.English[key] ??
      key
    );
  };


  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}


/* =========================================================
   USE LANGUAGE HOOK
========================================================= */

export function useLanguage() {

  const context = useContext(LanguageContext);

  if (!context) {

    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );

  }

  return context;
}

