import { useEffect } from 'react';

const Confetti = ({ show }) => {
  useEffect(() => {
    if (!show) return;

    const confettiCount = 50;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.left = Math.random() * 100 + '%';
      element.style.top = '-10px';
      element.style.width = '10px';
      element.style.height = '10px';
      element.style.backgroundColor = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][Math.floor(Math.random() * 5)];
      element.style.borderRadius = '50%';
      element.style.pointerEvents = 'none';
      element.style.zIndex = '9999';
      element.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear forwards`;
      document.body.appendChild(element);
      confetti.push(element);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      confetti.forEach(el => el.remove());
      style.remove();
    }, 3000);
  }, [show]);

  return null;
};

export default Confetti;
