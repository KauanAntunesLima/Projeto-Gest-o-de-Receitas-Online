function preview({target}) {
    document.getElementById('preview-img').src = URL.createObjectURL(target.files[0]);
}