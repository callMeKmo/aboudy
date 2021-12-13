FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateType,
)
FilePond.setOptions({
    itemInsertLocation: "after",
    imagePreviewHeight: '258px',
    imagePreviewWidth: '258px'
})

const inputElement = document.querySelector('input[type="file"]')

FilePond.create( inputElement, {
    acceptedFileTypes: ['image/png','image/jpeg','image/PNG','image/JPEG'],
    maxFiles:1,
    allowMultiple: false
})

FilePond.parse(document.body)