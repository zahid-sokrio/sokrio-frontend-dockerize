import {
  checkButtonWithTypeAndText,
  checkElementWithClassAndText,
  checkExtensionInURL,
  checkInputFieldWithTypeAndText,
  checkButtonWithClassAndIndex,
  checkElement,
  checkTextareaWithTextAndIndex,
  checkElementWithClassTextAndIndex,
  checkButtonWithClassIndexAndScrollIntoView,
  checkVisibleElementWithClassAndText,
  checkVisibleInputFieldWithTextAndIndex,
  checkButtonWithCypressSelector,
  checkButtonWithTypeIndexAndClass,
  checkButtonWithClassTextAndIndex,
  checkButtonWithClassAndText,
  checkExistingInputFieldWithTextAndIndex,
} from "../baseTests/validate";
import {
  clickButtonWithClassAndText,
  clickButtonWithClassAndIndex,
  clickButtonWithTypeAndText,
  enterTextInInputField,
  clickButtonWithClassTextAndIndex,
  waitForMillisecond,
  clickInputField,
  clickButtonWithCypressSelector,
  enterTextInTextareaWithPlaceholder,
  enterTextWithCypressSelector,
  enterTextInInputFieldWithIndex,
  selectFromScrollbar,
  clearTextInInputFieldWithIndex,
} from "../baseTests/action";
import {
  commonVars,
  inventory,
} from "../fixtures/constants";
import { generateDomain, generateCode } from "../helpers/helpers";

/*
 Test Case ID  : TC-10
 Test Case Name: Inventory
*/

export function inventoryTest() {
  checkExtensionInURL(commonVars.dashboardExtension);
  clickButtonWithClassAndText(commonVars.sideNavClass, commonVars.inventoryText);
  checkExtensionInURL(inventory.inventoryExtension);
  checkElementWithClassAndText(commonVars.tabClass, inventory.categoryText);
  checkElementWithClassAndText(commonVars.tabClass, commonVars.productText);
  checkElementWithClassAndText(commonVars.tabClass, inventory.brandText);
  checkElementWithClassAndText(commonVars.tabClass, inventory.variantText);
  checkElementWithClassAndText(commonVars.tabClass, inventory.batchText);
  checkElementWithClassAndText(commonVars.tabClass, inventory.promotionText);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentParenText);
  checkElement(commonVars.tableHeadClass, commonVars.statusText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentCreatedAtText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, inventory.addNewCategoryField, 1);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, inventory.selectParentField, 2);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  const newCategoryName = generateDomain();
  enterTextInInputField(inventory.addNewCategoryField, newCategoryName);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.saveButtonText);
  waitForMillisecond(500);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newCategoryName, 0);
  clickButtonWithClassAndIndex(commonVars.editButtonClass);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, inventory.addNewCategoryField, 1);
  checkInputFieldWithTypeAndText(commonVars.textFieldType, inventory.selectParentField, 2);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  clearTextInInputFieldWithIndex(inventory.addNewCategoryField, 0);
  const updateCategoryName = generateDomain();
  enterTextInInputFieldWithIndex(inventory.addNewCategoryField, 0, updateCategoryName);
  clickButtonWithCypressSelector(inventory.updateCategorySaveButton);
  waitForMillisecond(500);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, updateCategoryName, 0);
  clickButtonWithClassAndText(commonVars.tabClass, commonVars.productText, null);
  checkExtensionInURL(inventory.inventoryProductExtension);
  checkElement(commonVars.cardHeadClass, commonVars.productText);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentSkuText);
  checkElement(commonVars.tableHeadClass, inventory.brandText);
  checkElement(commonVars.tableHeadClass, inventory.categoryText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentFreeProduct);
  checkElement(commonVars.tableHeadClass, commonVars.statusText);
  waitForMillisecond(2000);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, null);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.eyeButtonClass, null);
  checkButtonWithClassIndexAndScrollIntoView(inventory.expandIconClass, null);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  checkButtonWithTypeAndText(commonVars.buttonType, inventory.addNewProductButtonText);
  checkButtonWithTypeAndText(commonVars.buttonType, inventory.addProductToABatchText);
  checkButtonWithClassAndIndex(commonVars.backArrowClass);
  checkElementWithClassAndText(inventory.flowChartHeadClass, inventory.flowChartHeadText);
  checkElementWithClassAndText(inventory.listClass, inventory.createProductListText);
  checkElementWithClassAndText(inventory.listClass, inventory.keepTrackListText);
  checkElementWithClassAndText(inventory.listClass, inventory.setProductListText);
  checkElementWithClassAndText(inventory.listClass, inventory.viewProductListText);
  clickButtonWithTypeAndText(commonVars.buttonType, inventory.addNewProductButtonText);
  checkVisibleInputFieldWithTextAndIndex(inventory.addProductNameFieldText, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.addProductSKUFieldText, null);
  checkButtonWithTypeIndexAndClass(commonVars.checkboxType, commonVars.checkboxClass);
  checkVisibleInputFieldWithTextAndIndex(inventory.addProductProductBrandFieldText, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.addProductProductCategoryFieldText, null);
  checkTextareaWithTextAndIndex(inventory.addProductDescriptionFieldText, 0);
  checkTextareaWithTextAndIndex(inventory.addProductUspFieldText, 1);
  checkVisibleInputFieldWithTextAndIndex(inventory.addproductToBatchNameTextField, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.addproductToBatchTextField, 0);
  checkVisibleInputFieldWithTextAndIndex(inventory.addproductToBatchTextField, 1);
  checkVisibleInputFieldWithTextAndIndex(inventory.addproductToBatchTextField, 2);
  checkButtonWithClassAndIndex(commonVars.datePickerClass, 0);
  checkButtonWithClassAndIndex(commonVars.datePickerClass, 1);
  checkButtonWithClassAndIndex(inventory.imageUploaderClass, 0);
  checkButtonWithClassAndIndex(commonVars.statusTypeClass, 1);
  checkVisibleInputFieldWithTextAndIndex(inventory.selectPriceForField, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.productPriceField, null);
  checkButtonWithClassTextAndIndex(inventory.priceListTableRowClass, commonVars.tableHeadContentNameText, 0);
  checkButtonWithClassTextAndIndex(inventory.priceListTableRowClass, commonVars.tableHeadContentTypeText, 0);
  checkButtonWithClassTextAndIndex(inventory.priceListTableRowClass, inventory.tableHeadContentPriceText, 0);
  checkVisibleInputFieldWithTextAndIndex(inventory.selectVariantField, null);
  checkButtonWithCypressSelector(inventory.variantValueField, "");
  checkButtonWithClassAndIndex(inventory.checkButtonClass, 0);
  checkButtonWithClassAndIndex(inventory.checkButtonClass, 1);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.saveButtonText);
  const baseProductName = generateDomain();
  enterTextInInputField(inventory.addProductNameFieldText, baseProductName);
  const sku = generateDomain();
  enterTextInInputField(inventory.addProductSKUFieldText, sku);
  clickButtonWithClassAndIndex(commonVars.rememberMeClass);
  clickInputField(inventory.addProductProductBrandFieldText, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkVisibleInputFieldWithTextAndIndex(inventory.addNewBrandField, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.selectParentField, null);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.saveButtonText);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  const newBrandName = generateDomain();
  enterTextInInputField(inventory.addNewBrandField, newBrandName);
  clickButtonWithClassTextAndIndex(commonVars.buttonClass, commonVars.saveButtonText);
  clickInputField(inventory.addProductProductCategoryFieldText, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkVisibleInputFieldWithTextAndIndex(inventory.addNewCategoryField, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.selectParentField, 1);
  checkButtonWithClassAndIndex(commonVars.statusTypeClass, 0);
  checkButtonWithCypressSelector(inventory.addNewCategorySaveButton, commonVars.saveButtonText);
  checkButtonWithCypressSelector(inventory.addNewCategoryCloseButton, commonVars.closeButtonText);
  const productNewCategoryName = generateDomain();
  enterTextInInputField(inventory.addNewCategoryField, productNewCategoryName);
  clickButtonWithCypressSelector(inventory.addNewCategorySaveButton);
  waitForMillisecond(1000);
  const productDescription = generateDomain();
  enterTextInTextareaWithPlaceholder(inventory.addProductDescriptionFieldText, productDescription);
  const productUps = generateDomain();
  enterTextInTextareaWithPlaceholder(inventory.addProductUspFieldText, productUps);
  clickInputField(inventory.addproductToBatchNameTextField, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkButtonWithCypressSelector(inventory.addBatchField, '');
  checkButtonWithClassAndText(inventory.addBatchSaveButton, commonVars.saveButtonText);
  checkButtonWithCypressSelector(inventory.addBatchCloseButton, commonVars.closeButtonText);
  const productBatchName = generateDomain();
  enterTextWithCypressSelector(inventory.addBatchField, productBatchName);
  clickButtonWithClassTextAndIndex(inventory.addBatchSaveButton, commonVars.saveButtonText);
  const qty = generateCode();
  enterTextInInputFieldWithIndex(inventory.addproductToBatchTextField, 0, qty);
  const mrp = generateCode();
  enterTextInInputFieldWithIndex(inventory.addproductToBatchTextField, 1, mrp);
  const stockPrice = generateCode();
  enterTextInInputFieldWithIndex(inventory.addproductToBatchTextField, 2, stockPrice);
  clickButtonWithClassAndIndex(commonVars.datePickerClass, 0);
  clickButtonWithClassAndIndex(inventory.nextMonthClass, 0);
  clickButtonWithClassAndIndex(inventory.dateSelectionClass, 20);
  clickButtonWithClassAndIndex(commonVars.datePickerClass, 1);
  clickButtonWithClassAndIndex(inventory.dateSelectionClass, 65);
  clickInputField(inventory.selectPriceForField, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkVisibleInputFieldWithTextAndIndex(inventory.selectDepartmentField, null);
  clickInputField(inventory.selectDepartmentField, 0);
  waitForMillisecond(2000);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  const productPrice = generateCode();
  enterTextInInputFieldWithIndex(inventory.productPriceField, 0, productPrice);
  clickButtonWithClassAndIndex(inventory.checkButtonClass, 0);
  checkButtonWithClassTextAndIndex(inventory.priceListTableRowClass, commonVars.departmentText, 1);
  checkButtonWithClassTextAndIndex(inventory.priceListTableRowClass, productPrice, 1);
  checkButtonWithClassAndIndex(inventory.productBatchPriceCrossButton, 0);
  clickInputField(inventory.selectVariantField, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  checkVisibleInputFieldWithTextAndIndex(inventory.addNewvariantNameField, null);
  checkButtonWithCypressSelector(inventory.addNewVariantSaveButton, commonVars.saveButtonText);
  checkButtonWithCypressSelector(inventory.addNewVariantCloseButton, commonVars.closeButtonText);
  const newVariant = generateDomain();
  enterTextInInputFieldWithIndex(inventory.addNewvariantNameField, 0, newVariant);
  clickButtonWithCypressSelector(inventory.addVariantSaveButton);
  const variantValue = generateDomain();
  enterTextWithCypressSelector(inventory.variantValueField, variantValue);
  clickButtonWithClassAndIndex(inventory.checkButtonClass, 1);
  checkButtonWithClassTextAndIndex(inventory.productVariantListClass, newVariant);
  checkButtonWithClassTextAndIndex(inventory.productVariantListClass, variantValue);
  clickButtonWithClassAndIndex(inventory.productSaveButton, 0);
  clickButtonWithClassAndText(commonVars.tabClass, commonVars.productText, null);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, baseProductName, 0);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, sku, 0);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newBrandName, 0);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, productNewCategoryName, 0);
  clickButtonWithClassAndIndex(commonVars.editButtonClass);
  checkVisibleInputFieldWithTextAndIndex(inventory.addProductNameFieldText, null);
  checkVisibleInputFieldWithTextAndIndex(inventory.updateSkuField, null);
  checkTextareaWithTextAndIndex(inventory.addProductDescriptionFieldText, 0);
  checkTextareaWithTextAndIndex(inventory.addProductUspFieldText, 1);
  clearTextInInputFieldWithIndex(inventory.addProductNameFieldText, 0);
  clearTextInInputFieldWithIndex(inventory.updateSkuField, 0);
  const updatedProductName = generateDomain();
  const updatedProductSku = generateDomain();
  enterTextInInputFieldWithIndex(inventory.addProductNameFieldText, 0, updatedProductName);
  enterTextInInputFieldWithIndex(inventory.updateSkuField, 0, updatedProductSku);
  clickButtonWithClassAndIndex(inventory.updateProductSaveButton);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, updatedProductName, 0);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, updatedProductSku, 0);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  checkVisibleInputFieldWithTextAndIndex(commonVars.productFieldText, null);
  checkExistingInputFieldWithTextAndIndex(commonVars.productBrandFieldText, null);
  checkExistingInputFieldWithTextAndIndex(commonVars.productCategoryFieldText, null);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.doneButtonText);
  checkVisibleElementWithClassAndText(commonVars.buttonClass, commonVars.resetButtonText);
  enterTextInInputFieldWithIndex(commonVars.productFieldText, 0, updatedProductName);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, updatedProductName, 0);
  clickButtonWithClassAndIndex(inventory.expandIconClass);
  checkElement(commonVars.tableHeadClass, inventory.batchText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentMrpText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentPurchaseAmount);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentQty);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentMgfDate);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentExpiresDate);
  checkElement(commonVars.tableHeadClass, commonVars.statusText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentPrices);
  checkElement(commonVars.tableHeadClass, inventory.variantText);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, productBatchName, 1);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, mrp, 1);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, stockPrice, 1);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, qty, 1);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.dayTagClass, 0);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.dayTagClass, 1);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, 1);
  clickButtonWithClassAndText(commonVars.buttonClass, inventory.showPricesButtonText);
  waitForMillisecond(2000);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, commonVars.departmentText, 2);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, productPrice, 2);
  clickButtonWithClassAndIndex(inventory.viewProductPriceCloseButton);
  clickButtonWithClassAndText(commonVars.buttonClass, inventory.showVariantsButtonText);
  waitForMillisecond(2000);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newVariant, 2);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, variantValue, 2);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, 2);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.deleteButtonClass, 0);
  checkElementWithClassTextAndIndex(inventory.showVariantCloseButton, commonVars.closeButtonText, 0);
  clickButtonWithClassAndIndex(inventory.showVariantCloseButton);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickInputField(commonVars.productBrandFieldText, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, newBrandName, 0);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.filterButtonText);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.resetButtonText);
  clickInputField(commonVars.productCategoryFieldText, 0);
  selectFromScrollbar(commonVars.scrollbarViewClass);
  clickButtonWithTypeAndText(commonVars.buttonType, commonVars.doneButtonText);
  checkElementWithClassTextAndIndex(commonVars.tableRowClass, productNewCategoryName, 0);
  clickButtonWithClassAndText(commonVars.tabClass, inventory.brandText, null);
  waitForMillisecond(2000);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentParenText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentCreatedAtText);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, null);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassAndText(commonVars.tabClass, inventory.variantText, null);
  waitForMillisecond(2000);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentCreatedAtText);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, null);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassAndText(commonVars.tabClass, inventory.batchText, null);
  waitForMillisecond(2000);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentNameText);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentCreatedAtText);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
  clickButtonWithClassAndText(commonVars.tabClass, inventory.promotionText, null);
  waitForMillisecond(2000);
  checkButtonWithClassAndIndex(commonVars.infoIconClass);
  checkButtonWithClassAndIndex(commonVars.videoTutorialClass);
  checkButtonWithTypeAndText(commonVars.buttonType, commonVars.addButtontext);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentTitle);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentOfferType);
  checkElement(commonVars.tableHeadClass, commonVars.tableHeadContentExpiersAtText);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentAssignedTo);
  checkElement(commonVars.tableHeadClass, inventory.tableHeadContentBanner);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.eyeButtonClass, null);
  checkButtonWithClassIndexAndScrollIntoView(commonVars.editButtonClass, null);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.addButtontext);
  clickButtonWithClassAndText(commonVars.buttonClass, commonVars.closeButtonText);
}