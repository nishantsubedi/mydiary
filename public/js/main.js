$(() =>{
    if($('textarea#ta').length){
        CKEDITOR.replace('ta');
    }
    $('a.confirmDeletion').on('click', () => {
        if(!confirm('Confirm deletion')) return false;

    })
});

var deleteThis = (id)  => {
    $("#confirmDeleteBtn").attr("href", "/diary/delete/" + id);
}