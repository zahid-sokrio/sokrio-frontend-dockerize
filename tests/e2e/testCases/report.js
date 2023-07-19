import {
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkButtonWithClassAndIndex,
  checkButtonWithClassTextAndIndex,
  checkElementWithClass,
  checkButtonWithClassAndText,
} from "../baseTests/validate";
import {
  clickButtonWithClassTextAndIndex, 
  waitForMillisecond,
} from "../baseTests/action";
import {
  commonVars,
  report,
} from "../fixtures/constants";

/* 
Test Case ID  : TC-15
Test Case Name: Reports
*/

export function reportTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassTextAndIndex(commonVars.sideNavClass, report.reportText);
  checkElementWithClassAndText(commonVars.tabClass, report.salesText, 0);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.productText, 1);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.visitText, 2)
  checkElementWithClassAndText(commonVars.tabClass, report.kpiText, 3);
  checkElementWithClassAndText(commonVars.tabClass, report.productBasedReportText, 4);
  checkElementWithClassAndText(commonVars.tabClass, report.hrReportText, 5);
  checkButtonWithClassTextAndIndex(report.salesReportCardClass, report.salesOrderText);
  checkButtonWithClassTextAndIndex(report.salesReportCardClass, report.srWiseSalesText);
  checkButtonWithClassAndText(report.titleClass, report.salesReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.optionIconClass, 1);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 1);
  checkButtonWithClassAndIndex(report.dateClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 1);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.salesOrderText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.dateText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.recipientText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndText(commonVars.buttonClass, report.emailMeText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.srWiseSalesText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.dateText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.recipientText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndText(commonVars.buttonClass, report.emailMeText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.productText, 0);
  checkButtonWithClassAndText(report.titleClass, report.productReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 0);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.productWiseSalesText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.dateText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.recipientText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndText(commonVars.buttonClass, report.emailMeText);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, commonVars.visitText, 0);
  waitForMillisecond(2000);
  checkButtonWithClassTextAndIndex(report.salesReportCardClass, report.visitTargetReportText);
  checkButtonWithClassTextAndIndex(report.salesReportCardClass, report.trackingReportText);
  checkButtonWithClassAndText(report.titleClass, report.kpiReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.optionIconClass, 1);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 1);
  checkButtonWithClassAndIndex(report.dateClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 1);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.visitTargetReportText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.territoryText);
  checkButtonWithClassAndText(report.visitDateClass, report.submissionText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndIndex(commonVars.buttonClass, 3);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.trackingReportText);
  checkButtonWithClassAndText(report.salesReportCardClass, report.selectDateText);
  checkButtonWithClassAndText(report.salesReportCardClass, report.territoryText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndIndex(commonVars.buttonClass, 3);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, report.kpiText, 0);
  checkButtonWithClassAndText(report.titleClass, report.kpiTitleText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 0);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.kpiReportText);
  checkButtonWithClassAndText(report.salesReportCardClass, commonVars.dateRange);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndIndex(commonVars.buttonClass, 3);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, report.productBasedReportText, 0);
  checkButtonWithClassAndText(report.titleClass, report.productBasedReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 0);
  clickButtonWithClassTextAndIndex(report.salesReportCardClass, report.productSummaryReportText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.selectDateText);
  checkButtonWithClassAndText(commonVars.addNewRequisitionClass, report.selectUserText);
  checkElementWithClass(commonVars.tableHeadUserClass, 0);
  checkButtonWithClassAndText(commonVars.tableHeadUserClass, commonVars.slText);
  checkButtonWithClassAndText(commonVars.tableHeadUserClass, commonVars.skuText);
  checkButtonWithClassAndText(commonVars.tableHeadUserClass, report.productNameText);
  checkButtonWithClassAndText(commonVars.tableHeadUserClass, report.variantText);
  checkButtonWithClassAndText(commonVars.tableHeadUserClass, report.batchNameText);
  checkButtonWithClassAndText(commonVars.tableHeadUserClass, report.qtyText);
  checkButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  checkButtonWithClassAndIndex(commonVars.buttonClass, 3);
  checkButtonWithClassAndIndex(commonVars.buttonClass, 4);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, report.hrReportText, 0);
  checkButtonWithClassAndText(commonVars.cardClass, report.taReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 0);
  checkButtonWithClassAndText(commonVars.cardClass, report.trackingReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 1);
  checkButtonWithClassAndIndex(report.infoIconClass, 1);
  checkButtonWithClassAndIndex(report.dateClass, 1);
  checkButtonWithClassAndText(commonVars.cardClass, report.checkInReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 2);
  checkButtonWithClassAndIndex(report.infoIconClass, 2);
  checkButtonWithClassAndIndex(report.dateClass, 2);
  clickButtonWithClassTextAndIndex(commonVars.tabClass, report.performanceText, 0);
  checkButtonWithClassAndText(commonVars.cardClass, report.dailyKpiReportText);
  checkButtonWithClassAndIndex(report.optionIconClass, 0);
  checkButtonWithClassAndIndex(report.infoIconClass, 0);
  checkButtonWithClassAndIndex(report.dateClass, 0);
}