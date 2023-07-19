export default interface ConfirmationOptions {
    title: string
    body?: string
    confirmBtnText?: string
    rejectBtnText?: string
    onAccept: Function
    onReject?: Function
}
