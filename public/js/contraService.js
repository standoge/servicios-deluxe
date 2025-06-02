document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const oldPass = document.getElementById('old_password').value;
    const newPass = document.getElementById('new_password').value;
    const confirm = document.getElementById('confirm_new_password').value;
    const user_id = document.getElementById('user_id').value;
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (newPass !== confirm) {
        alert('Las nuevas contraseñas no coinciden.');
        return;
    }
    if (!pattern.test(newPass)) {
        alert('La nueva contraseña debe tener mínimo 8 caracteres, al menos 1 letra, 1 número y 1 símbolo.');
        return;
    }

    try {
        const res = await fetch('/usuarios/'+user_id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                old_password: oldPass,
                password: newPass
            })
        });
        const data = await res.json();
        if (data.success) {
            alert('Contraseña cambiada correctamente');
            window.location.href = '/panelhome';
        } else {
            alert('Error: ' + (data.message || 'No se pudo cambiar la contraseña'));
        }
    } catch (err) {
        alert('Error de red');
    }
});