document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ส่วน Animation (ค่อยๆ ลอยขึ้นมา) ---
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

// --- ฟังก์ชันตรวจสอบว่าควรแสดง Popup หรือไม่ ---
function checkPopupStatus() {
    const hideUntil = localStorage.getItem('ancPopupHiddenUntil');
    const now = new Date().getTime();

    // ถ้ายังไม่มีค่า หรือ เวลาปัจจุบัน เลยเวลาที่กำหนดไว้แล้ว -> ให้แสดง Popup
    if (!hideUntil || now > hideUntil) {
        console.log("ANC Dev: Popup กำลังจะแสดงผล...");
        setTimeout(() => {
            const modalEl = document.getElementById('specialPolicyModal');
            if(modalEl) {
                const myModal = new bootstrap.Modal(modalEl);
                myModal.show();
            }
        }, 1500); // หน่วงเวลา 1.5 วินาที
    } else {
        // คำนวณเวลาที่เหลือ (นาที) สำหรับ Dev ดูใน Console
        const timeLeft = Math.round((hideUntil - now) / 1000 / 60);
        console.log(`ANC Dev: Popup ถูกซ่อนอยู่ จะแสดงอีกครั้งใน ${timeLeft} นาที`);
    }
}

// --- ฟังก์ชันเมื่อกดปุ่ม "ไม่แสดงอีก 1 ชั่วโมง" (แก้บั๊กเลื่อนหน้าจอไม่ได้) ---
function closePopupForHour() {
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000; 
    const futureTime = now + oneHour; 

    // บันทึกเวลา
    localStorage.setItem('ancPopupHiddenUntil', futureTime);
    console.log("ANC Dev: บันทึกเวลาปิด Popup 1 ชม. เรียบร้อย");

    // 1. สั่งปิด Modal ผ่าน Bootstrap Instance
    const modalEl = document.getElementById('specialPolicyModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    
    if (modalInstance) {
        modalInstance.hide(); 
    }

    // 2. บังคับปลดล็อคหน้าจอทันที (แก้ปัญหา Scroll ไม่ได้)
    setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // ลบฉากหลังสีดำที่อาจค้างอยู่
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
    }, 300); // รอจังหวะนิดนึงเพื่อให้ Animation จบก่อนค่อยลบ
}

// --- สำหรับ Developer (ปุ่ม Reset เวลา) ---
function resetPopupTimer() {
    localStorage.removeItem('ancPopupHiddenUntil');
    alert("Dev: ล้างค่าเวลาแล้ว! เว็บจะรีโหลดเพื่อแสดง Popup ใหม่");
    location.reload(); 
}