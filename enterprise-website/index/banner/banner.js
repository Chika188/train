         let currentIndex = 0;
        const slides = document.querySelector('.slides');
        const leftDots = document.querySelectorAll('.left-dots .dot');

        // 自动播放
        let autoPlay = setInterval(nextSlide, 5000);

        // 轮播图切换事件
        function updateSlide() {
            document.querySelectorAll('.slide').forEach(slide => {
                slide.classList.remove('active');
            });
            document.querySelectorAll('.slide')[currentIndex].classList.add('active');
            leftDots.forEach(dot => dot.classList.remove('active'));
            leftDots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % 3;
            updateSlide();
        }


        // 悬停暂停
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carousel.addEventListener('mouseleave', () => {
            autoPlay = setInterval(nextSlide, 5000);
        });


        // 轮播图 dot 点击切换事件
        leftDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoPlay);
                currentIndex = index;
                updateSlide();
                autoPlay = setInterval(nextSlide, 5000);
            });
        });