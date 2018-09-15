$(document).ready(function () {

    // Function to post a new note
    function postNote(element) {
        let note = {};
        note.articleId = $(element).attr('data-id'),
        note.body = $('#noteBodyEntry').val().trim();
        if (note.body) {
            $.ajax({
                url: '/notes/createNote',
                type: 'POST',
                data: note,
                success: function (response) {
                    showNote(response, note.articleId);
                    $('#noteBodyEntry').val('');
                },
                error: function (error) {
                    showErrorModal(error);
                }
            });
        }
    }



    // Function to display error modal
    function showErrorModal(error) {
        $('#error').modal('show');
    }



    // Function to display note modal
    function showNote(element, articleId) {
        let $title = $('<p>')
            .text(element.body);
        let $deleteButton = $('<button>')
            .text('Delete')
            .addClass('btn btn-danger btn-sm deleteNote');
        let $hr = $('<hr>');
        let $note = $('<div>')
            .append($hr, $title, $deleteButton)
            .attr('data-note-id', element._id)
            .attr('data-article-id', articleId)
            .addClass('note')
            .appendTo('#noteArea');            
    }



    // Event to reload page when modal is closed
    $('#alertModal').on('hide.bs.modal', function (e) {
        window.location.href = '/';
    });



    // Event to scrape new articles
    $('#scrapeNew').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/scrape/new',
            type: 'GET',
            success: function (response) {
                $('#modalMsg').text(response.count + ' articles scraped.');
            },
            error: function (error) {
                showErrorModal(error);
            },
            complete: function (result) {
                $('#alertModal').modal('show');
            }
        });
    });



    // Event to scrape archive articles
    $('#scrapeArchive').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/scrape/archive',
            type: 'GET',
            success: function (response) {
                $('#modalMsg').text('Archive articles scraped.');
            },
            error: function (error) {
                showErrorModal(error);
            },
            complete: function (result) {
                $('#alertModal').modal('show');
            }
        });
    });

    // Event to delete all articles and notes
    $('#destroyData').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/articles/destroyAll',
            type: 'DELETE',
            success: function (response) {
                $('#modalMsg').text('All articles and notes have been deleted.');
            },
            error: function (error) {
                showErrorModal(error);
            },
            complete: function (result) {
                $('#alertModal').modal('show');
            }
        });
        $.ajax({
            url: '/notes/destroyAll',
            type: 'DELETE',
            success: function (response) {
                $('#modalMsg').text('All articles and notes have been deleted.');
            },
            error: function (error) {
                showErrorModal(error);
            },
            complete: function (result) {
                $('#alertModal').modal('show');
            }
        });

    });



    // Event to save article
    $(document).on('click', '.saveArticle', function (e) {
        let articleId = $(this).data('id');
        $.ajax({
            url: '/articles/save/' + articleId,
            type: 'GET',
            success: function (response) {
                window.location.href = '/';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });



    // Event to hide article
    // (hide instead of delete to keep articles from
    // from reappearing after being deleted)
    $(document).on('click', '.hideArticle', function (e) {
        let articleId = $(this).data('id');
        $.ajax({
            url: '/articles/hide/' + articleId,
            type: 'GET',
            success: function (response) {
                window.location.href = '/';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });  



    // Event to add/populate note modal
    $('.addNote').on('click', function (e) {
        $('#noteArea').empty();
        $('#noteBodyEntry').val('');
        let id = $(this).data('id');
        $('#submitNote, #noteBodyEntry').attr('data-id', id);
        $.ajax({
            url: '/notes/getNotes/' + id,
            type: 'GET',
            success: function (data) {
                $.each(data.notes, function (i, item) {
                    showNote(item, id);
                });
                $('#noteModal').modal('show');
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    }); 



    // Event to create note
    $('#submitNote').on('click', function (e) {
        e.preventDefault();
        postNote($(this));
    }); 



    // Event to delete article
    $('.delArticle').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            url: '/articles/deleteArticle/' + id,
            type: 'DELETE',
            success: function (response) {
                window.location.href = '/articles/viewSaved';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });



    // Event to delete note
    $(document).on('click', '.deleteNote', function (e) {
        e.stopPropagation();
        let thisItem = $(this);
        let ids = {
            noteId: $(this).parent().data('note-id'),
            articleId: $(this).parent().data('article-id')
        };

        $.ajax({
            url: '/notes/deleteNote',
            type: 'POST',
            data: ids,
            success: function (response) {
                thisItem.parent().remove();
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });


    
    // Event to get notes for modal
    $(document).on('click', '.note', function (e) {
        e.stopPropagation();
        let id = $(this).data('note-id');
        $.ajax({
            url: '/notes/getSingleNote/' + id,
            type: 'GET',
            success: function (note) {
                $('#noteBodyEntry').val(note.body);
            },
            error: function (error) {
                console.log(error);
                showErrorModal(error);
            }
        });
    });

});