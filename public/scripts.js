function curtir(artigo, comentario) {
    var c = 0, nc = 0;
    var curtir = $('#curtir_'+comentario);
    var curtidas = $('#curtidas_'+comentario);
    var naocurtir = $('#naocurtir_'+comentario);
    var naocurtidas = $('#naocurtidas_'+comentario);
    if(curtir.hasClass('marcado')) {
        curtir.removeClass('marcado');
        localStorage.removeItem('comentario_'+comentario);
        c = -1;
    }
    else {
        if(naocurtir.hasClass('marcado')) {
            naocurtir.removeClass('marcado');
            nc = -1;
        }
        curtir.addClass('marcado');
        localStorage.setItem('comentario_'+comentario, 1)
        c = 1;
    }
    var request = $.ajax( {
        url: '/api/comentario/'+artigo+'/'+comentario,
        method: 'PUT',
        data: { curtir: c, naocurtir: nc },
        dataType: 'json'
    });
    request.done(function(dados) {
        $('#curtidas_'+comentario).text(dados.curtidas);
        $('#naocurtidas_'+comentario).text(dados.naocurtidas);
    });
}

function naocurtir(artigo, comentario) {
    var c = 0; nc = 0;
    var curtir = $('#curtir_'+comentario);
    var curtidas = $('#curtidas_'+comentario);
    var naocurtir = $('#naocurtir_'+comentario);
    var naocurtidas = $('#naocurtidas_'+comentario);
    if(naocurtir.hasClass('marcado')) {
        nc = -1;
        naocurtir.removeClass('marcado');
        localStorage.removeItem('comentario_'+comentario);
    }
    else {
        if(curtir.hasClass('marcado')) {
            curtir.removeClass('marcado');
            c = -1;
        }
        nc = 1;
        naocurtir.addClass('marcado');
        localStorage.setItem('comentario_'+comentario, -1)
    }
    var request = $.ajax( {
        url: '/api/comentario/'+artigo+'/'+comentario,
        method: 'PUT',
        data: { curtir: c, naocurtir: nc },
        dataType: 'json'
    });
    request.done(function(dados) {
        $('#curtidas_'+comentario).text(dados.curtidas);
        $('#naocurtidas_'+comentario).text(dados.naocurtidas);
    });
 
}