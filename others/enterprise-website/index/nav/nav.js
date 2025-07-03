    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            window.location.href = this.dataset.target;
        });
    });

    const menuBtn = document.getElementById('menuBtn');
    const drawer = document.querySelector('.nav-drawer');

    menuBtn.addEventListener('click', () => {
        drawer.classList.toggle('translate-x-0');
        drawer.classList.toggle('-translate-x-full');
    });

    // 点击外部关闭抽屉
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
            drawer.classList.remove('translate-x-0');
            drawer.classList.add('-translate-x-full');
        }
    });