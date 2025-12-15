function abrirFeedback() {
    const modal = document.createElement('dialog');
    modal.className = 'avaliacao-modal';

    const title = document.createElement('h1');
    title.textContent = 'Avaliação';

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'avaliacao-feedback';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('img');
        star.className = 'star';
        star.dataset.value = i;
        star.src = '../img/Star 4.svg';
        star.alt = `Estrela ${i}`;
        feedbackDiv.appendChild(star);
    }

    const feedbackInput = document.createElement('input');
    feedbackInput.type = 'text';
    feedbackInput.className = 'avaliacao-input';
    feedbackInput.id = 'user-feedback';
    feedbackInput.placeholder = 'Descreva sua opinião..';

    const responseDiv = document.createElement('div');
    responseDiv.className = 'avaliacao-response';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'avaliacao-btn';
    cancelBtn.textContent = 'Cancelar';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'avaliacao-btn';
    submitBtn.textContent = 'Enviar';

    responseDiv.appendChild(cancelBtn);
    responseDiv.appendChild(submitBtn);

    modal.appendChild(title);
    modal.appendChild(feedbackDiv);
    modal.appendChild(feedbackInput);
    modal.appendChild(responseDiv);
    document.body.appendChild(modal);

    modal.showModal();

    let selectedRating = 0;
    const urlParams = new URLSearchParams(window.location.search);
    const receitaId = urlParams.get('id');

    const starsElements = modal.querySelectorAll('.star');

    starsElements.forEach((star, index) => {
        star.src = '../img/Star 4.svg'; 

        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStars(selectedRating);
        });

        star.addEventListener('mouseenter', () => {
            const hoverValue = index + 1;
            updateStarsHover(hoverValue);
        });
    });

    function updateStars(rating) {
        starsElements.forEach((star, index) => {
            if (index < rating) {
                star.src = '../img/Star 5.svg';
            } else {
                star.src = '../img/Star 4.svg';
            }
        });
    }

    function updateStarsHover(rating) {
        starsElements.forEach((star, index) => {
            if (index < rating) {
                star.src = '../img/Star 5.svg';
            } else {
                star.src = '../img/Star 4.svg';
            }
        });
    }

    feedbackDiv.addEventListener('mouseleave', () => {
        updateStars(selectedRating);
    });

    const closeModal = () => {
        modal.close();
        modal.remove();
    };

    cancelBtn.addEventListener('click', closeModal);

    submitBtn.addEventListener('click', () => {
        if (selectedRating === 0) {
            alert('Por favor, selecione uma nota!');
            return;
        }

        const descricao = document.getElementById('user-feedback').value.trim();
        enviarAvaliacao(receitaId, selectedRating, descricao);
        closeModal();
    });
}

function enviarAvaliacao(receitaId, nota, descricao) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Erro: usuário não está logado!');
        return;
    }

    const userData = JSON.parse(usuarioLogado);
    const usuarioId = userData.response.usuario.id_usuario;

    const avaliacaoData = {
        id_usuario: usuarioId,
        id_receita: parseInt(receitaId),
        nota: nota,
        descricao: descricao || ''
    };

    fetch('http://localhost:8080/v1/toque_gourmet/avaliacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(avaliacaoData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status_code = 201) {

            alert('Avaliação enviada com sucesso!');
        } else {
            alert('Erro ao enviar avaliação: ' + (result.message || 'Tente novamente.'));
        }
    })
    .catch(error => {
        console.error('Erro ao enviar avaliação:', error);
        alert('Erro ao enviar avaliação. Tente novamente mais tarde.');
    });
}

function avaliarReceita() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        if (typeof window.abrirLogin === 'function') {
            sessionStorage.setItem('avaliarAposLogin', 'true');
            window.abrirLogin();
        } else {
            alert('Sistema de login não disponível. Por favor, atualize a página e tente novamente.');
        }
    } else {
        abrirFeedback();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const avaliarBtn = document.getElementById('avaliar-btn');
    if (avaliarBtn) {
        avaliarBtn.addEventListener('click', avaliarReceita);
    }


    const avaliarAposLogin = sessionStorage.getItem('avaliarAposLogin');
    if (avaliarAposLogin === 'true') {
        sessionStorage.removeItem('avaliarAposLogin');
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        if (usuarioLogado) {

            setTimeout(() => {
                abrirFeedback();
            }, 300);
        }
    }
});