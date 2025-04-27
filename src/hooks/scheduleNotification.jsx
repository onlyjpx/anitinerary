export const scheduleNotification = async (item) => {
    // Cria uma notificação flutuante na UI
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
      <div class="toast-body">
        ✅ Você será notificado sobre <strong>${item.title}</strong>!
      </div>
    `;

    document.body.appendChild(notification);

    // Remove após 3 segundos
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);

    return true; // Simula sucesso
};