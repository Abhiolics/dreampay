/**
 * DreamPay Interactive Engine
 * Handles micro-interactions, live ticker simulations, earnings calculator,
 * modal dialogs, and real-time social proof notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveWithdrawalsCounter();
  initCopyReferralCode();
  initEarningsCalculator();
  initMockupInteractions();
  initTaskTagTabs();
  initModals();
  initMobileNav();
  initRealtimePillsStream();
  initScrollHeader();
});

/* 1. Header scroll effect */
function initScrollHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Live Withdrawals Counter Tick */
function initLiveWithdrawalsCounter() {
  const counterEl = document.getElementById('liveWithdrawalsCount');
  if (!counterEl) return;

  let currentCount = 12840;
  
  // Periodically increment to simulate dynamic live platform volume
  setInterval(() => {
    const increment = Math.floor(Math.random() * 2) + 1;
    currentCount += increment;
    counterEl.textContent = currentCount.toLocaleString('en-IN');
  }, 4500);
}

/* 3. Copy Referral Code to Clipboard */
function initCopyReferralCode() {
  const copyBtn = document.getElementById('copyRefBtn');
  const codeEl = document.getElementById('refCodeText');
  const labelEl = document.getElementById('copyBtnLabel');
  if (!copyBtn || !codeEl) return;

  copyBtn.addEventListener('click', async () => {
    const code = codeEl.textContent.trim();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older environments
        const temp = document.createElement('textarea');
        temp.value = code;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      
      const originalText = labelEl.textContent;
      labelEl.textContent = 'Copied!';
      copyBtn.style.background = '#10b981';
      copyBtn.style.color = '#ffffff';

      setTimeout(() => {
        labelEl.textContent = originalText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2200);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  });
}

/* 4. Interactive Earnings Calculator */
function initEarningsCalculator() {
  const tasksSlider = document.getElementById('tasksSlider');
  const refSlider = document.getElementById('refSlider');
  const tasksVal = document.getElementById('tasksSliderVal');
  const refVal = document.getElementById('refSliderVal');
  const monthlyOutput = document.getElementById('simMonthlyAmt');

  if (!tasksSlider || !refSlider || !monthlyOutput) return;

  function calculateEarnings() {
    const tasksPerDay = parseInt(tasksSlider.value, 10);
    const referrals = parseInt(refSlider.value, 10);

    // Update labels
    tasksVal.textContent = `${tasksPerDay} ${tasksPerDay === 1 ? 'task' : 'tasks'}/day`;
    refVal.textContent = `${referrals} ${referrals === 1 ? 'friend' : 'friends'}`;

    // Average task reward: ₹30, 30 days. Referral average monthly bonus: ₹450 per active friend
    const taskEarnings = tasksPerDay * 28 * 30;
    const referralEarnings = referrals * 420;
    const streakBonus = Math.round((taskEarnings + referralEarnings) * 0.15);
    const total = taskEarnings + referralEarnings + streakBonus;

    monthlyOutput.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  tasksSlider.addEventListener('input', calculateEarnings);
  refSlider.addEventListener('input', calculateEarnings);
  calculateEarnings();

  // "Simulate Instant Withdrawal" trigger
  const simWithdrawBtn = document.getElementById('simWithdrawBtn');
  if (simWithdrawBtn) {
    simWithdrawBtn.addEventListener('click', () => {
      const currentAmt = monthlyOutput.textContent;
      openWithdrawalModal(`₹${Math.min(parseInt(currentAmt.replace(/[^0-9]/g, ''), 10) || 520, 1200)}.00`);
    });
  }
}

/* 5. Hero Mockup Wallet Card Interactions */
function initMockupInteractions() {
  const balanceEl = document.getElementById('mockupBalance');
  const heroWithdrawBtn = document.getElementById('heroWithdrawBtn');
  const heroEarnMoreBtn = document.getElementById('heroEarnMoreBtn');
  const taskItems = document.querySelectorAll('.mockup-task-item');

  let balance = 2840.00;

  if (heroWithdrawBtn) {
    heroWithdrawBtn.addEventListener('click', () => {
      openWithdrawalModal('₹520.00');
    });
  }

  if (heroEarnMoreBtn) {
    heroEarnMoreBtn.addEventListener('click', () => {
      const productSection = document.getElementById('product');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Clicking mini tasks adds bonus to balance
  taskItems.forEach(item => {
    item.addEventListener('click', () => {
      const payout = parseFloat(item.dataset.taskPayout || '20');
      balance += payout;
      if (balanceEl) {
        balanceEl.textContent = `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      // Visual feedback
      const rewardPill = item.querySelector('.task-reward-pill');
      if (rewardPill) {
        const originalText = rewardPill.textContent;
        rewardPill.textContent = 'Earned! ✓';
        rewardPill.style.background = '#10b981';
        rewardPill.style.color = '#fff';

        setTimeout(() => {
          rewardPill.textContent = originalText;
          rewardPill.style.background = '';
          rewardPill.style.color = '';
        }, 1500);
      }
    });
  });
}

/* 6. Bento Task Tag Tabs */
function initTaskTagTabs() {
  const tags = document.querySelectorAll('.task-tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });
}

/* 7. Modal Dialogs */
function initModals() {
  const loginModal = document.getElementById('loginModal');
  const openLoginBtn = document.getElementById('openLoginBtn');
  const closeLoginBtn = document.getElementById('closeLoginModal');

  const withdrawalModal = document.getElementById('withdrawalSuccessModal');
  const closeWithdrawalBtn = document.getElementById('closeWithdrawalModal');

  // Open login
  if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
      const input = document.getElementById('phoneInput');
      if (input) setTimeout(() => input.focus(), 100);
    });
  }

  // Close login
  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });
  }

  // Close withdrawal
  if (closeWithdrawalBtn && withdrawalModal) {
    closeWithdrawalBtn.addEventListener('click', () => {
      withdrawalModal.classList.remove('active');
    });
  }

  // Click outside to dismiss
  [loginModal, withdrawalModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (loginModal) loginModal.classList.remove('active');
      if (withdrawalModal) withdrawalModal.classList.remove('active');
    }
  });

  // Global helper for opening withdrawal modal
  window.openWithdrawalModal = function(amountStr) {
    if (!withdrawalModal) return;
    const amtEl = document.getElementById('modalWithdrawalAmt');
    if (amtEl && amountStr) {
      amtEl.textContent = amountStr;
    }
    withdrawalModal.classList.add('active');
  };

  // Login form handler
  window.handleLoginSubmit = function() {
    const input = document.getElementById('phoneInput');
    if (!input || !input.value) return;
    
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Verifying...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'OTP Sent to Mobile! ✓';
        submitBtn.style.background = '#10b981';

        setTimeout(() => {
          if (loginModal) loginModal.classList.remove('active');
          submitBtn.textContent = 'Send OTP';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 1200);
      }, 900);
    }
  };
}

/* 8. Mobile Navigation Drawer */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  // Close when clicking nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}

/* 9. Realtime Payouts Toast Stream (Social Proof) */
function initRealtimePillsStream() {
  const toast = document.getElementById('liveStreamToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMeta = document.getElementById('toastMeta');
  if (!toast || !toastTitle || !toastMeta) return;

  const mockPayouts = [
    { title: 'Withdrawal successful ₹520', meta: 'Rohan V. · Just now · UPI' },
    { title: 'Withdrawal successful ₹1,200', meta: 'Ananya S. · 8s ago · IMPS' },
    { title: 'Withdrawal successful ₹350', meta: 'Vikas P. · 14s ago · Paytm' },
    { title: 'Withdrawal successful ₹815', meta: 'Siddharth M. · Just now · PhonePe' },
    { title: 'Withdrawal successful ₹230', meta: 'Pooja K. · 20s ago · UPI' },
    { title: 'Withdrawal successful ₹480', meta: 'Amit D. · 5s ago · GPay' },
    { title: 'Withdrawal successful ₹95', meta: 'Kiran T. · Just now · UPI' },
    { title: 'Withdrawal successful ₹275', meta: 'Deepak R. · 12s ago · Bank' }
  ];

  let index = 0;

  function showNextToast() {
    const item = mockPayouts[index % mockPayouts.length];
    index++;

    toastTitle.textContent = item.title;
    toastMeta.textContent = item.meta;

    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4500);
  }

  // Start after 3.5s, then cycle every 9 seconds
  setTimeout(() => {
    showNextToast();
    setInterval(showNextToast, 9000);
  }, 3500);
}
