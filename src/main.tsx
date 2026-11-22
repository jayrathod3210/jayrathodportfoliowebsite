import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import './styles/index.css';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { SmoothScroll } from './components/fx/SmoothScroll';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* "user": honours the OS "reduce motion" setting for every Motion animation. */}
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SmoothScroll>
    </MotionConfig>
  </StrictMode>,
);
