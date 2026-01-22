document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ส่วน Animation (ค่อยๆ ลอยขึ้นมาเมื่อ Scroll ถึง) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach((el) => {
        observer.observe(el);
    });

    // --- 2. เรียกตรวจสอบ Popup ทันทีที่โหลดเว็บ ---
    checkPopupStatus();
});

// --- ฟังก์ชันตรวจสอบสถานะ Popup ---
function checkPopupStatus() {
    // ใช้ sessionStorage: จะแสดง Popup 1 ครั้งต่อการเปิดเบราว์เซอร์ครั้งนั้นๆ
    // หากผู้ใช้ปิด Tab แล้วเข้าใหม่ Popup จะปรากฏอีกครั้ง (ป้องกันการเผลอกดปิดแล้วหาไม่เจอ)
    const isClosed = sessionStorage.getItem('ancPopupClosed');

    if (!isClosed) {
        console.log("ANC Dev: กำลังเตรียมแสดง Popup นโยบาย...");
        setTimeout(() => {
            const modalEl = document.getElementById('specialPolicyModal');
            if(modalEl) {
                const myModal = new bootstrap.Modal(modalEl);
                myModal.show();
            }
        }, 1500); // หน่วงเวลา 1.5 วินาทีให้ดูนุ่มนวล
    } else {
        console.log("ANC Dev: Popup ถูกปิดไปแล้วใน Session นี้");
    }
}

// --- ฟังก์ชันปิด Popup (ใช้เมื่อกดปุ่ม "รับทราบ" หรือ "ดูนโยบาย") ---
function closePopupSimple() {
    // บันทึกสถานะว่าปิดแล้วใน Session นี้
    sessionStorage.setItem('ancPopupClosed', 'true');
    console.log("ANC Dev: ปิด Popup เรียบร้อย (จะแสดงอีกครั้งเมื่อเปิด Browser ใหม่)");

    // 1. สั่งปิด Modal ผ่าน Bootstrap Instance
    const modalEl = document.getElementById('specialPolicyModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    
    if (modalInstance) {
        modalInstance.hide(); 
    }

    // 2. บังคับปลดล็อคหน้าจอ (แก้ปัญหา Scroll ไม่ได้หลังจากปิด Modal)
    setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // ลบฉากหลังสีดำ (Backdrop) ที่อาจค้างอยู่
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
    }, 300);
}

// --- สำหรับ Developer (ปุ่ม Reset เพื่อทดสอบ) ---
function resetPopupTimer() {
    sessionStorage.removeItem('ancPopupClosed');
    localStorage.removeItem('ancPopupHiddenUntil'); // ล้างค่าเก่าเผื่อมีค้างในเครื่อง
    alert("Dev: ล้างค่าการแสดงผลแล้ว! ระบบจะรีโหลดเพื่อแสดง Popup ใหม่");
    location.reload(); 
}