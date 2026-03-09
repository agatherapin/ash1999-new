'use client';

import { useEffect, useRef } from 'react';
import { projects, Project } from '@/data/projects';

function optimizedSrc(src: string, width: number = 640): string {
    if (src.endsWith('.gif')) return src;
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

export default function Portfolio() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const filterContainerRef = useRef<HTMLDivElement>(null);
    const filterToggleRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const modalBodyRef = useRef<HTMLDivElement>(null);
    const modalCloseRef = useRef<HTMLButtonElement>(null);
    const fullscreenViewerRef = useRef<HTMLDivElement>(null);
    const fullscreenImgRef = useRef<HTMLImageElement>(null);
    const fullscreenCloseRef = useRef<HTMLButtonElement>(null);
    const fullscreenCounterRef = useRef<HTMLDivElement>(null);
    const instructionsRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current!;
        const canvas = canvasRef.current!;
        const filterContainer = filterContainerRef.current!;
        const filterToggle = filterToggleRef.current!;
        const modal = modalRef.current!;
        const modalBody = modalBodyRef.current!;
        const modalClose = modalCloseRef.current!;
        const fullscreenViewer = fullscreenViewerRef.current!;
        const fullscreenImg = fullscreenImgRef.current!;
        const fullscreenClose = fullscreenCloseRef.current!;
        const fullscreenCounter = fullscreenCounterRef.current!;
        const cursorDot = cursorDotRef.current;
        const loader = loaderRef.current;

        let fullscreenImages: string[] = [];
        let fullscreenIndex = 0;

        // =============================================
        // STATE
        // =============================================
        let isDragging = false;
        let hasMoved = false;
        let startX = 0;
        let startY = 0;
        let scrollLeftVal = 0;
        let scrollTopVal = 0;
        let velocityX = 0;
        let velocityY = 0;
        let lastX = 0;
        let lastY = 0;
        let lastTime = 0;
        let animationId: number | null = null;
        let mouseX = 0;
        let mouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;
        const activeFilters = new Set(['all']);
        const itemsCache: HTMLElement[] = [];
        const flipTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
        let dragRafPending = false;
        let parallaxX = 0;
        let parallaxY = 0;
        let parallaxRafId: number | null = null;
        let alive = true;
        let loaderHidden = false;

        function updateCanvasTransform() {
            canvas.style.transform = `translate3d(${scrollLeftVal + parallaxX}px, ${scrollTopVal + parallaxY}px, 0)`;
        }

        function getCardScale() {
            const w = window.innerWidth;
            if (w <= 480) return 0.85;
            if (w <= 768) return 0.85;
            return 1;
        }

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        function getCanvasScale() {
            const w = window.innerWidth;
            if (w <= 480) return 1.8;
            if (w <= 768) return 1.8;
            return 1;
        }

        const canvasScale = getCanvasScale();
        const TILE_WIDTH = (window.innerWidth + 300) * canvasScale;
        const TILE_HEIGHT = (window.innerHeight + 300) * canvasScale;

        // =============================================
        // FILTERS
        // =============================================
        function handleFilterToggleClick() {
            filterContainer.classList.toggle('open');
            filterToggle.classList.toggle('active');
        }
        filterToggle.addEventListener('click', handleFilterToggleClick);

        function handleDocumentClickForFilter(e: MouseEvent) {
            if (!(e.target as Element).closest('.filter-wrapper')) {
                filterContainer.classList.remove('open');
                filterToggle.classList.remove('active');
            }
        }
        document.addEventListener('click', handleDocumentClickForFilter);

        function createFilterButtons() {
            const allTags = new Set<string>();
            projects.forEach(project => {
                project.tags.forEach(tag => allTags.add(tag));
            });

            const sortedTags = Array.from(allTags).sort();

            sortedTags.forEach(tag => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.textContent = tag;
                btn.dataset.filter = tag;
                btn.addEventListener('click', () => toggleFilter(tag));
                filterContainer.appendChild(btn);
            });
        }

        function toggleFilter(filter: string) {
            if (filter === 'all') {
                activeFilters.clear();
                activeFilters.add('all');
            } else {
                activeFilters.delete('all');
                if (activeFilters.has(filter)) {
                    activeFilters.delete(filter);
                } else {
                    activeFilters.add(filter);
                }
                if (activeFilters.size === 0) {
                    activeFilters.add('all');
                }
            }

            updateFilterButtons();
            filterItems();
        }

        function updateFilterButtons() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                const filter = (btn as HTMLElement).dataset.filter;
                btn.classList.toggle('active', activeFilters.has(filter!));
            });
        }

        function filterItems() {
            itemsCache.forEach((item, index) => {
                const project = projects[index % projects.length];
                const shouldShow = activeFilters.has('all') ||
                                  project.tags.some(tag => activeFilters.has(tag));
                item.classList.toggle('hidden', !shouldShow);
            });
        }

        // =============================================
        // CANVAS ITEMS
        // =============================================
        function createItems() {
            const scale = getCardScale();
            const fragment = document.createDocumentFragment();

            for (let tileY = -1; tileY <= 1; tileY++) {
                for (let tileX = -1; tileX <= 1; tileX++) {
                    projects.forEach((project) => {
                        const item = document.createElement('div');
                        item.className = 'item';

                        const scaledWidth = project.width * scale;
                        const itemHeight = scaledWidth / project.aspectRatio;
                        item.style.width = scaledWidth + 'px';
                        item.style.height = itemHeight + 'px';

                        const baseTop = (project.top / 100) * TILE_HEIGHT;
                        const baseLeft = (project.left / 100) * TILE_WIDTH;
                        const finalTop = baseTop + (tileY * TILE_HEIGHT);
                        const finalLeft = baseLeft + (tileX * TILE_WIDTH);

                        item.style.top = finalTop + 'px';
                        item.style.left = finalLeft + 'px';
                        item.style.transform = 'translate(-50%, -50%)';

                        const coverHTML = project.video
                            ? `<video muted loop playsinline class="img-fade-in" src="${project.video}"></video>`
                            : `<div class="img-placeholder" data-src="${project.image}" data-alt="${project.title}"></div>`;

                        item.innerHTML = `
                            <div class="item-card" style="aspect-ratio: ${project.aspectRatio};">
                                <div class="card-face card-front">
                                    <div class="item-image">
                                        ${coverHTML}
                                        <div class="overlay">
                                            <h3>${project.title}</h3>
                                            <div class="date">${project.subtitle}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-face card-back">
                                    <div class="card-back-content">
                                        <h3 class="back-title">${project.title}</h3>
                                        <p class="back-description">${project.description}</p>
                                    </div>
                                    <button class="view-more-btn">See full project</button>
                                </div>
                            </div>
                        `;

                        function unflipItem() {
                            if (!item.classList.contains('flipped')) return;
                            item.classList.remove('flipped');
                            flipTimers.delete(item);
                            const video = item.querySelector('video') as HTMLVideoElement | null;
                            if (video) {
                                video.style.visibility = '';
                                video.play().catch(() => {});
                            }
                        }

                        item.addEventListener('click', (e) => {
                            if (!hasMoved) {
                                if ((e.target as Element).classList.contains('view-more-btn')) {
                                    e.stopPropagation();
                                    openModal(project);
                                } else {
                                    item.classList.toggle('flipped');
                                    const video = item.querySelector('video') as HTMLVideoElement | null;

                                    const existingTimer = flipTimers.get(item);
                                    if (existingTimer) clearTimeout(existingTimer);

                                    if (item.classList.contains('flipped')) {
                                        if (video) {
                                            video.style.visibility = 'hidden';
                                            video.pause();
                                        }
                                        flipTimers.set(item, setTimeout(unflipItem, 6000));
                                    } else {
                                        flipTimers.delete(item);
                                        if (video) {
                                            video.style.visibility = '';
                                            video.play().catch(() => {});
                                        }
                                    }
                                }
                            }
                        });

                        fragment.appendChild(item);
                        itemsCache.push(item);
                    });
                }
            }

            canvas.appendChild(fragment);

            canvas.querySelectorAll('video').forEach(v => {
                (v as HTMLVideoElement).play().catch(() => {});
            });
        }

        // =============================================
        // DRAG & SCROLL
        // =============================================
        function handleMouseDown(e: MouseEvent) {
            isDragging = true;
            hasMoved = false;
            scrollContainer.classList.add('dragging');
            if (cursorDot) { cursorDot.style.visibility = 'hidden'; cursorDot.classList.remove('hover'); }
            startX = e.pageX - scrollLeftVal;
            startY = e.pageY - scrollTopVal;
            lastX = e.pageX;
            lastY = e.pageY;
            lastTime = performance.now();
            velocityX = 0;
            velocityY = 0;

            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        scrollContainer.addEventListener('mousedown', handleMouseDown);

        function _applyDragTransform() {
            updateCanvasTransform();
            dragRafPending = false;
        }

        const MAX_VELOCITY = 60;

        function handleMouseMove(e: MouseEvent) {
            if (!isDragging) return;
            e.preventDefault();

            const now = performance.now();
            const dt = now - lastTime;

            const x = e.pageX - startX;
            const y = e.pageY - startY;

            const moveDistance = Math.abs(e.pageX - lastX) + Math.abs(e.pageY - lastY);
            if (moveDistance > 5 && !hasMoved) {
                hasMoved = true;
                canvas.style.pointerEvents = 'none';
            }

            if (dt > 0) {
                velocityX = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, (e.pageX - lastX) / dt * 16));
                velocityY = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, (e.pageY - lastY) / dt * 16));
            }

            scrollLeftVal = x;
            scrollTopVal = y;
            wrapPosition();

            lastX = e.pageX;
            lastY = e.pageY;
            lastTime = now;

            if (!dragRafPending) {
                dragRafPending = true;
                requestAnimationFrame(_applyDragTransform);
            }
        }
        document.addEventListener('mousemove', handleMouseMove);

        function handleMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            scrollContainer.classList.remove('dragging');
            canvas.style.pointerEvents = '';
            if (cursorDot) cursorDot.style.visibility = '';
            applyMomentum();
        }
        document.addEventListener('mouseup', handleMouseUp);

        function handleWheel(e: WheelEvent) {
            e.preventDefault();

            scrollLeftVal -= e.deltaX;
            scrollTopVal -= e.deltaY;

            velocityX = -e.deltaX * 0.5;
            velocityY = -e.deltaY * 0.5;

            wrapPosition();
            updateCanvasTransform();

            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            applyMomentum();
        }
        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        // =============================================
        // TOUCH EVENTS (mobile/tablet)
        // =============================================
        function handleTouchStart(e: TouchEvent) {
            const touch = e.touches[0];
            isDragging = true;
            hasMoved = false;
            scrollContainer.classList.add('dragging');
            startX = touch.pageX - scrollLeftVal;
            startY = touch.pageY - scrollTopVal;
            lastX = touch.pageX;
            lastY = touch.pageY;
            lastTime = performance.now();
            velocityX = 0;
            velocityY = 0;

            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });

        function handleTouchMove(e: TouchEvent) {
            if (!isDragging) return;
            e.preventDefault();

            const touch = e.touches[0];
            const now = performance.now();
            const dt = now - lastTime;

            const x = touch.pageX - startX;
            const y = touch.pageY - startY;

            const moveDistance = Math.abs(touch.pageX - lastX) + Math.abs(touch.pageY - lastY);
            if (moveDistance > 5 && !hasMoved) {
                hasMoved = true;
                canvas.style.pointerEvents = 'none';
            }

            if (dt > 0) {
                velocityX = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, (touch.pageX - lastX) / dt * 16));
                velocityY = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, (touch.pageY - lastY) / dt * 16));
            }

            scrollLeftVal = x;
            scrollTopVal = y;
            wrapPosition();

            lastX = touch.pageX;
            lastY = touch.pageY;
            lastTime = now;

            if (!dragRafPending) {
                dragRafPending = true;
                requestAnimationFrame(_applyDragTransform);
            }
        }
        scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

        function handleTouchEnd() {
            if (!isDragging) return;
            isDragging = false;
            scrollContainer.classList.remove('dragging');
            canvas.style.pointerEvents = '';
            applyMomentum();
        }
        scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

        function wrapPosition() {
            while (scrollLeftVal > TILE_WIDTH / 2) {
                scrollLeftVal -= TILE_WIDTH;
                startX -= TILE_WIDTH;
            }
            while (scrollLeftVal < -TILE_WIDTH / 2) {
                scrollLeftVal += TILE_WIDTH;
                startX += TILE_WIDTH;
            }

            while (scrollTopVal > TILE_HEIGHT / 2) {
                scrollTopVal -= TILE_HEIGHT;
                startY -= TILE_HEIGHT;
            }
            while (scrollTopVal < -TILE_HEIGHT / 2) {
                scrollTopVal += TILE_HEIGHT;
                startY += TILE_HEIGHT;
            }
        }

        function applyMomentum() {
            const friction = 0.95;
            const threshold = 0.5;

            function animate() {
                if (!alive) return;
                if (Math.abs(velocityX) > threshold || Math.abs(velocityY) > threshold) {
                    velocityX *= friction;
                    velocityY *= friction;

                    scrollLeftVal += velocityX;
                    scrollTopVal += velocityY;

                    wrapPosition();
                    updateCanvasTransform();

                    animationId = requestAnimationFrame(animate);
                } else {
                    animationId = null;
                }
            }

            animate();
        }

        // =============================================
        // PARALLAX (desktop only)
        // =============================================
        const PARALLAX_STRENGTH = 20;

        function animateParallax() {
            if (!alive) return;
            if (isDragging) {
                parallaxRafId = null;
                return;
            }

            currentMouseX += (mouseX - currentMouseX) * 0.08;
            currentMouseY += (mouseY - currentMouseY) * 0.08;

            parallaxX = currentMouseX * PARALLAX_STRENGTH;
            parallaxY = currentMouseY * PARALLAX_STRENGTH;
            updateCanvasTransform();

            const settled = Math.abs(mouseX - currentMouseX) < 0.001 && Math.abs(mouseY - currentMouseY) < 0.001;
            if (!settled) {
                parallaxRafId = requestAnimationFrame(animateParallax);
            } else {
                parallaxRafId = null;
            }
        }

        function handleDesktopMouseMove(e: MouseEvent) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!isDragging && !parallaxRafId) {
                parallaxRafId = requestAnimationFrame(animateParallax);
            }
            if (cursorDot && !isDragging) {
                cursorDot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
            }
        }

        if (!isTouchDevice) {
            document.addEventListener('mousemove', handleDesktopMouseMove);
        }

        // =============================================
        // MODAL
        // =============================================
        function openModal(project: Project) {
            preloadGallery(project);

            const galleryHTML = project.gallery ? project.gallery.map(item => {
                if (item.startsWith('vimeo:')) {
                    const videoId = item.replace('vimeo:', '');
                    return `<div class="modal-gallery-item modal-video">
                        <iframe src="https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1"
                            style="width: 100%; height: 100%; border-radius: 12px;"
                            frameborder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen>
                        </iframe>
                    </div>`;
                } else if (item.startsWith('video:')) {
                    const videoSrc = item.replace('video:', '');
                    return `<div class="modal-gallery-item modal-video">
                        <video controls autoplay loop muted>
                            <source src="${videoSrc}" type="video/mp4">
                        </video>
                    </div>`;
                } else {
                    return `<div class="modal-gallery-item"><img src="${optimizedSrc(item, 828)}" data-full="${item}" alt="${project.title}" loading="lazy"></div>`;
                }
            }).join('') : '';

            const tagsHTML = project.tags.map(tag =>
                `<span class="modal-tag">${tag}</span>`
            ).join('');

            modalBody.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-title">${project.title}</h2>
                    <p class="modal-subtitle">${project.subtitle}</p>
                    <div class="modal-tags">${tagsHTML}</div>
                </div>
                ${galleryHTML ? `<div class="modal-gallery">${galleryHTML}</div>` : ''}
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            const imageOnlyUrls = project.gallery
                ? project.gallery.filter(item => !item.startsWith('vimeo:') && !item.startsWith('video:'))
                : [];

            if (imageOnlyUrls.length > 0) {
                const galleryItems = modalBody.querySelectorAll('.modal-gallery-item:not(.modal-video)');
                galleryItems.forEach((item, i) => {
                    (item as HTMLElement).style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        openFullscreen(imageOnlyUrls, i);
                    });
                });
            }
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function handleModalCloseClick() {
            closeModal();
        }
        modalClose.addEventListener('click', handleModalCloseClick);

        function handleModalBackdropClick(e: MouseEvent) {
            if (e.target === modal) {
                closeModal();
            }
        }
        modal.addEventListener('click', handleModalBackdropClick);

        function handleKeyDown(e: KeyboardEvent) {
            if (fullscreenViewer.classList.contains('active')) {
                if (e.key === 'Escape') closeFullscreen();
                if (e.key === 'ArrowRight') navigateFullscreen(1);
                if (e.key === 'ArrowLeft') navigateFullscreen(-1);
                return;
            }
            if (modal.classList.contains('active')) {
                if (e.key === 'Escape') closeModal();
                return;
            }
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                navigateByArrow(e.key);
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        // =============================================
        // FULLSCREEN IMAGE VIEWER
        // =============================================
        function openFullscreen(images: string[], index: number) {
            fullscreenImages = images;
            fullscreenIndex = index;
            updateFullscreenImage();
            fullscreenViewer.classList.add('active');
        }

        function closeFullscreen() {
            fullscreenViewer.classList.remove('active');
            fullscreenImg.hidden = true;
            fullscreenImg.removeAttribute('src');
        }

        function navigateFullscreen(direction: number) {
            fullscreenIndex += direction;
            if (fullscreenIndex >= fullscreenImages.length) fullscreenIndex = 0;
            if (fullscreenIndex < 0) fullscreenIndex = fullscreenImages.length - 1;
            updateFullscreenImage();
        }

        function updateFullscreenImage() {
            fullscreenImg.hidden = false;
            fullscreenImg.src = fullscreenImages[fullscreenIndex];
            fullscreenCounter.textContent = `${fullscreenIndex + 1} / ${fullscreenImages.length}`;
        }

        function handleFullscreenCloseClick() {
            closeFullscreen();
        }
        fullscreenClose.addEventListener('click', handleFullscreenCloseClick);

        function handleFullscreenBackdropClick(e: MouseEvent) {
            if (e.target === fullscreenViewer) closeFullscreen();
        }
        fullscreenViewer.addEventListener('click', handleFullscreenBackdropClick);

        let fsStartX = 0;
        function handleFsTouchStart(e: TouchEvent) {
            fsStartX = e.touches[0].clientX;
        }
        fullscreenViewer.addEventListener('touchstart', handleFsTouchStart, { passive: true });

        function handleFsTouchEnd(e: TouchEvent) {
            const diff = e.changedTouches[0].clientX - fsStartX;
            if (Math.abs(diff) > 50) {
                navigateFullscreen(diff > 0 ? -1 : 1);
            }
        }
        fullscreenViewer.addEventListener('touchend', handleFsTouchEnd, { passive: true });

        // =============================================
        // ASYNC IMAGE LOADING WITH PLACEHOLDERS
        // =============================================
        function swapPlaceholders(src: string) {
            const displaySrc = optimizedSrc(src);
            itemsCache.forEach(item => {
                const placeholder = item.querySelector(`.img-placeholder[data-src="${CSS.escape(src)}"]`);
                if (!placeholder) return;
                const el = placeholder as HTMLElement;
                const img = document.createElement('img');
                img.src = displaySrc;
                img.setAttribute('alt', el.dataset.alt || '');
                img.decoding = 'async';
                img.classList.add('img-fade-in');
                placeholder.replaceWith(img);
            });
        }

        function loadImagesAsync() {
            const staticProjects = projects.filter(p => !p.video);
            const allUrls = new Set(staticProjects.map(p => p.image));
            const webpUrls: string[] = [];
            const gifUrls: string[] = [];

            allUrls.forEach(src => {
                if (src.endsWith('.gif')) {
                    gifUrls.push(src);
                } else {
                    webpUrls.push(src);
                }
            });

            let webpDone = 0;
            const totalWebp = webpUrls.length;

            function tryLoadGifs() {
                gifUrls.forEach(src => {
                    const img = new window.Image();
                    img.onload = () => swapPlaceholders(src);
                    img.onerror = () => swapPlaceholders(src);
                    img.src = src;
                });
            }

            webpUrls.forEach(src => {
                const img = new window.Image();
                img.src = optimizedSrc(src);
                img.decode()
                    .then(() => {
                        swapPlaceholders(src);
                        if (webpDone >= 2) hideLoader();
                        if (++webpDone >= totalWebp) tryLoadGifs();
                    })
                    .catch(() => {
                        swapPlaceholders(src);
                        if (webpDone >= 2) hideLoader();
                        if (++webpDone >= totalWebp) tryLoadGifs();
                    });
            });

            if (totalWebp === 0) tryLoadGifs();
        }

        // =============================================
        // RESET VIEW
        // =============================================
        function animateScrollTo(targetX: number, targetY: number) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            const sX = scrollLeftVal;
            const sY = scrollTopVal;
            const startTime = performance.now();
            const duration = 400;
            function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
            function step() {
                if (!alive) return;
                const progress = Math.min((performance.now() - startTime) / duration, 1);
                const e = easeOutCubic(progress);
                scrollLeftVal = sX + (targetX - sX) * e;
                scrollTopVal = sY + (targetY - sY) * e;
                updateCanvasTransform();
                if (progress < 1) {
                    animationId = requestAnimationFrame(step);
                } else {
                    wrapPosition();
                    updateCanvasTransform();
                    animationId = null;
                }
            }
            step();
        }

        // =============================================
        // ARROW KEY NAVIGATION
        // =============================================
        function navigateByArrow(key: string) {
            const stepX = window.innerWidth * 0.35;
            const stepY = window.innerHeight * 0.35;
            let targetX = scrollLeftVal;
            let targetY = scrollTopVal;
            switch (key) {
                case 'ArrowRight': targetX -= stepX; break;
                case 'ArrowLeft':  targetX += stepX; break;
                case 'ArrowDown':  targetY -= stepY; break;
                case 'ArrowUp':    targetY += stepY; break;
            }
            animateScrollTo(targetX, targetY);
        }

        // =============================================
        // CUSTOM CURSOR
        // =============================================
        function handleCursorOver(e: MouseEvent) {
            if (isDragging || !cursorDot) return;
            const target = (e.target as Element).closest('.item, button, a, .modal-gallery-item');
            if (target) cursorDot.classList.add('hover');
        }

        function handleCursorOut(e: MouseEvent) {
            if (isDragging || !cursorDot) return;
            const target = (e.target as Element).closest('.item, button, a, .modal-gallery-item');
            if (target) cursorDot.classList.remove('hover');
        }

        if (!isTouchDevice && cursorDot) {
            document.addEventListener('mouseover', handleCursorOver);
            document.addEventListener('mouseout', handleCursorOut);
        }

        // =============================================
        // LOADER
        // =============================================
        function hideLoader() {
            if (loaderHidden || !loader) return;
            loaderHidden = true;
            loader.classList.add('loaded');
            setTimeout(() => { loader.style.display = 'none'; }, 700);
        }

        const loaderTimeout = setTimeout(hideLoader, 3000);

        // =============================================
        // ON-DEMAND GALLERY PRELOAD
        // =============================================
        const preloadedGalleries = new Set<string>();

        function preloadGallery(project: Project) {
            if (preloadedGalleries.has(project.title)) return;
            preloadedGalleries.add(project.title);

            if (!project.gallery) return;
            project.gallery.forEach(src => {
                if (src.startsWith('vimeo:') || src.startsWith('video:')) return;
                const img = new window.Image();
                img.src = optimizedSrc(src, 828);
                img.decode().catch(() => {});
            });
        }

        // =============================================
        // INIT
        // =============================================
        createFilterButtons();
        createItems();
        loadImagesAsync();

        if (isTouchDevice) {
            const instructions = instructionsRef.current;
            if (instructions) {
                instructions.textContent = 'SWIPE TO MOVE · TAP TO FLIP';
            }
        }

        if (cursorDot) {
            cursorDot.style.transform = `translate(calc(${window.innerWidth / 2}px - 50%), calc(${window.innerHeight / 2}px - 50%))`;
        }

        // =============================================
        // CLEANUP
        // =============================================
        return () => {
            alive = false;
            clearTimeout(loaderTimeout);

            if (animationId) cancelAnimationFrame(animationId);
            if (parallaxRafId) cancelAnimationFrame(parallaxRafId);


            filterToggle.removeEventListener('click', handleFilterToggleClick);
            document.removeEventListener('click', handleDocumentClickForFilter);
            scrollContainer.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            scrollContainer.removeEventListener('wheel', handleWheel);

            scrollContainer.removeEventListener('touchstart', handleTouchStart);
            scrollContainer.removeEventListener('touchmove', handleTouchMove);
            scrollContainer.removeEventListener('touchend', handleTouchEnd);

            if (!isTouchDevice) {
                document.removeEventListener('mousemove', handleDesktopMouseMove);
                document.removeEventListener('mouseover', handleCursorOver);
                document.removeEventListener('mouseout', handleCursorOut);
            }

            modalClose.removeEventListener('click', handleModalCloseClick);
            modal.removeEventListener('click', handleModalBackdropClick);
            document.removeEventListener('keydown', handleKeyDown);

            fullscreenClose.removeEventListener('click', handleFullscreenCloseClick);
            fullscreenViewer.removeEventListener('click', handleFullscreenBackdropClick);
            fullscreenViewer.removeEventListener('touchstart', handleFsTouchStart);
            fullscreenViewer.removeEventListener('touchend', handleFsTouchEnd);

            flipTimers.forEach(t => clearTimeout(t));
            flipTimers.clear();
            canvas.innerHTML = '';
        };
    }, []);

    return (
        <>
            {/* LOADER */}
            <div className="loader-overlay" ref={loaderRef}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/etoile-logo.webp" alt="" className="loader-logo" />
                <div className="loader-bar"><div className="loader-bar-inner" /></div>
            </div>

            {/* HEADER */}
            <div className="header">
                <div className="logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={optimizedSrc('/img/etoile-logo.webp', 256)} alt="ash1999" width={80} height={80} />
                </div>

                {/* FILTER MENU */}
                <div className="filter-wrapper">
                    <button className="filter-toggle" ref={filterToggleRef}>Filters</button>
                    <div className="filter-container" ref={filterContainerRef}>
                        <button className="filter-btn active" data-filter="all">All</button>
                    </div>
                </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="instructions" ref={instructionsRef}>
                SCROLL/DRAG TO MOVE · CLICK TO FLIP
            </div>

            {/* MAIN CANVAS */}
            <div className="main-container">
                <div className="scroll-container" ref={scrollContainerRef}>
                    <div className="canvas" ref={canvasRef}></div>
                </div>
            </div>

            {/* MODAL */}
            <div className="modal" ref={modalRef}>
                <div className="modal-content">
                    <button className="modal-close" ref={modalCloseRef}>×</button>
                    <div className="modal-body" ref={modalBodyRef}></div>
                </div>
            </div>

            {/* FULLSCREEN IMAGE VIEWER */}
            <div className="fullscreen-viewer" ref={fullscreenViewerRef}>
                <button className="fullscreen-close" ref={fullscreenCloseRef}>×</button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={fullscreenImgRef} alt="" hidden />
                <div className="fullscreen-counter" ref={fullscreenCounterRef}></div>
            </div>

            {/* CUSTOM CURSOR */}
            <div className="cursor-dot" ref={cursorDotRef} />
        </>
    );
}
