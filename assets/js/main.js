"use strict";

document.addEventListener("DOMContentLoaded", function () {

    function addNotProseClass() {
        document.querySelectorAll(".kg-card").forEach(el => {
            el.classList.add("not-prose");
        });
    }

    function responsiveTable() {
        document.querySelectorAll('.post-content > table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'trex-table';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    function initLightBox() {
        lightbox(
            '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
        );
    }

    function load_more_posts() {
        if(document.getElementById('trex_blog')) {
            const nextLink = document.querySelector('.pagination .older-posts');
            if (!nextLink) {
                return;
            }
            
            let elem = document.getElementById('trex_blog');
            let infScroll = new InfiniteScroll(elem, {
                append: '.trex_post',
                button: '.infinite-scroll-button',
                debug: false,
                hideNav: '.pagination',
                history: false,
                path: '.pagination .older-posts',
                scrollThreshold: false,
                status: '.infinite-scroll-status',
            });

            infScroll.on( 'append', function( body, path, items, response ) {
                setTimeout(() => {
                    trex_tooltip();
                    assignTagClasses();
                }, 100);
            });
        }
    }

    function trex_tooltip() {
        tippy('.trex-tipy-tag', {
            content(reference) {
                const id = reference.getAttribute('data-template');
                const template = document.getElementById(id);
                if (!template) return '';
                const content = template.innerHTML;
                return content.replace(/>\s*([a-z])/i, (match, letter) => {
                    return match.replace(letter, letter.toUpperCase());
                });
            },
            allowHTML: true,
        });

        tippy('[data-tippy-content]');
    }

    function copy_link() {
        const btn = document.getElementById('copy-link-btn');
        if(btn) {
            const instance = tippy('#copy-link-btn', {
                trigger: 'manual',
            });
            document.getElementById('copy-link-btn').addEventListener('click', () => {
                const fullUrl = window.location.href;
                navigator.clipboard.writeText(fullUrl).then(() => {
                    instance[0].setContent('Link copied!');
                    instance[0].show();
                    setTimeout(() => {
                        instance[0].hide();
                    }, 2000);
                });
            });
        }
    }

    function fixCommentsCtaColors() {
        const isDark = document.documentElement.classList.contains('dark');
        if (!isDark) return;

        const css =
            `section[data-testid="cta-box"] h1,` +
            `section[data-testid="cta-box"] h2,` +
            `section[data-testid="cta-box"] h3{color:#ffffff!important}` +
            `section[data-testid="cta-box"] p,` +
            `section[data-testid="cta-box"] span{color:rgba(255,255,255,0.8)!important}`;

        const ghostEl = document.querySelector('ghost-comments');
        const root = ghostEl && ghostEl.shadowRoot;
        if (!root) return;

        let styleEl = root.getElementById('ux-arena-cta-fix');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'ux-arena-cta-fix';
            root.appendChild(styleEl);
        }
        styleEl.textContent = css;
    }

    function watchGhostStyles() {
        // Re-apply when Ghost injects its own styles into <head>
        const headObserver = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.tagName === 'STYLE' && node.id !== 'ux-arena-cta-fix') {
                        fixCommentsCtaColors();
                    }
                }
            }
        });
        headObserver.observe(document.head, { childList: true });

        // Also watch for ghost-comments element being added to the DOM
        const bodyObserver = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.tagName === 'GHOST-COMMENTS') {
                        // Shadow root may not be populated yet; defer slightly
                        setTimeout(fixCommentsCtaColors, 300);
                        bodyObserver.disconnect();
                    }
                }
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }


    /* THEME SWITCHER — disabled, restore when ready
    function switchModeFn() {
        var theme = localStorage.theme || 'dark';
        document.documentElement.classList.remove('dark', 'sepia');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (theme === 'sepia') {
            document.documentElement.classList.add('sepia');
        }
        fixCommentsCtaColors();
    }

    function watchMode() {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var handler = function(e) {
            if (!localStorage.theme) {
                document.documentElement.classList.toggle('dark', e.matches);
                document.documentElement.classList.remove('sepia');
            }
        };
        try {
            mq.addEventListener('change', handler);
        } catch (e) {
            mq.addListener(handler);
        }
    }

    function bindSwitchModeBtn() {
        var btn = document.querySelector('.switch-mode');
        if (btn) {
            btn.addEventListener('click', function () {
                var current = localStorage.theme || 'dark';
                var next = { dark: 'light', light: 'sepia', sepia: 'dark' };
                localStorage.theme = next[current] || 'light';
                switchModeFn();
            });
        }
    }

    // To re-enable: uncomment above + uncomment the three calls below:
    // switchModeFn();
    // watchMode();
    // bindSwitchModeBtn();
    */

    function trending_tags() {
        var c = document.getElementById("trending-tags");
        if (!c) return;
        const trending_tags = new Splide('#trending-tags', {
            type: 'loop',
            perPage: 4,
            pagination: false,
            arrows: false,
            perMove: 1,
            gap: 16,
            breakpoints: {
                1024: {
                    perPage: 3,
                },
                834: {
                    perPage: 2,
                },
                640: {
                    perPage: 1,
                }
            }
        }).mount();

        const prevBtn = document.getElementById("move-left");
        const nextBtn = document.getElementById("move-right");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => trending_tags.go("<"));
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", () => trending_tags.go(">"));
        }
    }

    function tag_section() {
        var c = document.getElementById("tag-section");
        if (!c) return;
        const trending_tags = new Splide('#tag-section', {
            type: 'loop',
            perPage: 4,
            pagination: false,
            arrows: false,
            perMove: 1,
            gap: 16,
            breakpoints: {
                1024: {
                    perPage: 3,
                },
                834: {
                    perPage: 2,
                },
                640: {
                    perPage: 1,
                }
            }
        }).mount();

        const prevBtn = document.getElementById("move-left-two");
        const nextBtn = document.getElementById("move-right-two");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => trending_tags.go("<"));
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", () => trending_tags.go(">"));
        }
    }

    function createResponsiveNavigation() {
        const navContainer = document.getElementById('main-nav');
        if (!navContainer) return null;

        const maxLinks = parseInt(navContainer.getAttribute('data-number-links'), 10);
        if (isNaN(maxLinks)) return null;

        const moreLabel = navContainer.getAttribute('data-label') || "More";
        const navList = navContainer.querySelector('.nav');
        if (!navList) return null;

        const allLinks = Array.from(navList.children || []);
        if (allLinks.length === 0) return null;

        // If we have more links than the maximum allowed
        if (allLinks.length > maxLinks) {
            // Get the links that should be moved to dropdown
            const linksToMove = allLinks.slice(maxLinks);
            if (linksToMove.length === 0) return null;

            // Remove the extra links from the main navigation
            linksToMove.forEach(link => {
                if (link && navList.contains(link)) {
                    navList.removeChild(link);
                }
            });

            // Create the "More" dropdown
            const moreDropdown = document.createElement('li');
            moreDropdown.className = 'nav-more relative';
            moreDropdown.innerHTML = `
                <button class="more-toggle flex items-center" type="button">
                    <span>${moreLabel}</span>
                    <span>
                        <svg class="w-4 h-4 ml-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </span>
                </button>
                <ul class="dropdown-menu trex-dropdown opacity-0 invisible"></ul>
            `;

            const dropdownMenu = moreDropdown.querySelector('.dropdown-menu');
            if (!dropdownMenu) return null;

            // Add the moved links to the dropdown
            linksToMove.forEach(link => {
                if (!link) return;

                const dropdownItem = document.createElement('li');
                dropdownItem.className = 'trex-sublink-wrapper';

                if (link.className) {
                    dropdownItem.className += ' ' + link.className;
                }
                if (link.id) {
                    dropdownItem.id = link.id;
                }

                const originalLink = link.querySelector('a');
                if (!originalLink) return;

                const newLink = originalLink.cloneNode(true);
                newLink.className = 'trex-sublink';

                if (originalLink.className) {
                    newLink.className += ' ' + originalLink.className;
                }
                if (originalLink.id) {
                    newLink.id = originalLink.id;
                }

                dropdownItem.appendChild(newLink);
                dropdownMenu.appendChild(dropdownItem);
            });

            // Add the dropdown to the navigation
            navList.appendChild(moreDropdown);

            // Dropdown toggle elements
            const toggleButton = moreDropdown.querySelector('.more-toggle');
            const dropdownMenuElement = moreDropdown.querySelector('.dropdown-menu');
            const chevronIcon = toggleButton ? toggleButton.querySelector('svg') : null;

            if (!toggleButton || !dropdownMenuElement) return null;

            let isOpen = false;

            function toggleDropdown(forceClose = false) {
                isOpen = forceClose ? false : !isOpen;

                if (isOpen) {
                    dropdownMenuElement.classList.remove('opacity-0', 'invisible', 'scale-95');
                    dropdownMenuElement.classList.add('opacity-100', 'visible', 'scale-100');
                    if (chevronIcon) chevronIcon.style.transform = 'rotate(180deg)';
                } else {
                    dropdownMenuElement.classList.add('opacity-0', 'invisible', 'scale-95');
                    dropdownMenuElement.classList.remove('opacity-100', 'visible', 'scale-100');
                    if (chevronIcon) chevronIcon.style.transform = 'rotate(0deg)';
                }
            }

            // Toggle dropdown on button click
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!moreDropdown.contains(e.target) && isOpen) {
                    toggleDropdown(true);
                }
            });

            // Close dropdown on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isOpen) {
                    toggleDropdown(true);
                }
            });

            // Handle keyboard navigation
            const dropdownLinks = dropdownMenuElement.querySelectorAll('a');
            toggleButton.addEventListener('keydown', function(e) {
                if ((e.key === 'Enter' || e.key === ' ') && dropdownLinks.length > 0) {
                    e.preventDefault();
                    toggleDropdown();
                    if (isOpen) dropdownLinks[0].focus();
                } else if (e.key === 'ArrowDown' && isOpen && dropdownLinks.length > 0) {
                    e.preventDefault();
                    dropdownLinks[0].focus();
                }
            });

            // Handle arrow key navigation within dropdown
            dropdownLinks.forEach((link, index) => {
                link.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextIndex = (index + 1) % dropdownLinks.length;
                        dropdownLinks[nextIndex].focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevIndex = index === 0 ? dropdownLinks.length - 1 : index - 1;
                        dropdownLinks[prevIndex].focus();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        toggleDropdown(true);
                        toggleButton.focus();
                    }
                });
            });
        }

        // Always reveal navContainer if it exists
        navContainer.classList.remove("hidden");
        return true;
    }

    function assignTagClasses() {
        document.querySelectorAll('.post-tags').forEach(function(container) {
            var links = Array.from(container.querySelectorAll('a'));
            var ranks = ['primary', 'secondary', 'tertiary'];
            links.forEach(function(link, i) {
                if (i < ranks.length) link.classList.add(ranks[i]);
            });
        });
    }

    function initFooterShare() {
        const form = document.getElementById('footer-share-form');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('share-email-input').value.trim();
            if (!email) return;
            const subject = encodeURIComponent('Thought you might like this');
            const body = encodeURIComponent(
                'Hey,\n\n' +
                'This site/article sounds cool and informative — I thought you might be interested.\n\n' +
                window.location.href +
                '\n\nEnjoy!'
            );
            window.open('mailto:' + email + '?subject=' + subject + '&body=' + body);
            form.reset();
        });
    }

    window.membershipClick = function(radio) {
        if (radio.value === "month") {
            document.getElementById("trex_membership").classList.remove("trex_plan_yearly_price");
            document.getElementById("trex_membership").classList.add("trex_plan_monthly_price");
        } else {
            document.getElementById("trex_membership").classList.remove("trex_plan_monthly_price");
            document.getElementById("trex_membership").classList.add("trex_plan_yearly_price");
        }
    };

    function defaultCheckMembership() {
        const yearlyRadio = document.getElementById("trex_plan_year");
        if(yearlyRadio) {
            yearlyRadio.checked = true;
            membershipClick(yearlyRadio);
        }
    }

    function taxonomy_name() {
        let names = document.getElementsByClassName('trex_taxonomy_name');
        [].forEach.call(names, function (el) {
            const fullName = el.innerText.trim();
            el.setAttribute('title', fullName);
            el.setAttribute('aria-label', fullName);
            el.innerText = getFirstLetters(fullName);
            el.classList.remove("hidden");
            el.classList.add("flex");
        });
    }

    function getFirstLetters(str) {
        const firstLetters = str
        .split(' ')
        .map(word => word[0])
        .join('');
    
        return firstLetters;
    }

    function readingProgress() {
        var bar = document.getElementById('reading-progress-bar');
        if (!bar || !document.querySelector('.post-content')) return;
        window.addEventListener('scroll', function() {
            var scrolled = window.scrollY;
            var total = document.body.scrollHeight - window.innerHeight;
            bar.style.width = (total > 0 ? Math.min((scrolled / total) * 100, 100) : 0) + '%';
        }, { passive: true });
    }

    function readerControls() {
        var panel = document.getElementById('reader-panel');
        var toggle = document.getElementById('reader-toggle');
        var controls = document.getElementById('reader-controls');
        if (!panel || !toggle || !controls) return;

        // Font size
        var fontSize = parseFloat(localStorage.getItem('reader-font-size') || '1');
        function applyFontSize() {
            document.documentElement.style.setProperty('--reader-font-size', fontSize + 'rem');
            localStorage.setItem('reader-font-size', fontSize);
        }
        applyFontSize();
        document.getElementById('font-decrease').addEventListener('click', function() {
            fontSize = Math.max(0.8, parseFloat((fontSize - 0.1).toFixed(1)));
            applyFontSize();
        });
        document.getElementById('font-reset').addEventListener('click', function() {
            fontSize = 1;
            applyFontSize();
        });
        document.getElementById('font-increase').addEventListener('click', function() {
            fontSize = Math.min(1.6, parseFloat((fontSize + 0.1).toFixed(1)));
            applyFontSize();
        });

        // Line height
        var lineHeight = parseFloat(localStorage.getItem('reader-line-height') || '0');
        function applyLineHeight() {
            if (lineHeight > 0) {
                document.documentElement.style.setProperty('--reader-line-height', lineHeight);
                localStorage.setItem('reader-line-height', lineHeight);
            } else {
                document.documentElement.style.removeProperty('--reader-line-height');
                localStorage.removeItem('reader-line-height');
            }
            document.getElementById('lh-decrease').classList.toggle('reader-active', lineHeight > 0 && lineHeight <= 1.5);
            document.getElementById('lh-increase').classList.toggle('reader-active', lineHeight >= 2);
        }
        applyLineHeight();
        document.getElementById('lh-decrease').addEventListener('click', function() {
            lineHeight = 1.4;
            applyLineHeight();
        });
        document.getElementById('lh-increase').addEventListener('click', function() {
            lineHeight = 2.1;
            applyLineHeight();
        });

        // Reading / focus mode
        var readingModeBtn = document.getElementById('reading-mode-btn');
        readingModeBtn.addEventListener('click', function() {
            document.documentElement.classList.toggle('reading-mode');
            readingModeBtn.classList.toggle('reader-active', document.documentElement.classList.contains('reading-mode'));
        });

        // Toggle panel
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.classList.toggle('hidden');
        });
        document.addEventListener('click', function(e) {
            if (!controls.contains(e.target)) panel.classList.add('hidden');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') panel.classList.add('hidden');
        });
    }

    function textSelectionMenu() {
        var menu = document.getElementById('selection-menu');
        var content = document.querySelector('.post-content');
        if (!menu || !content) return;

        document.addEventListener('mouseup', function() {
            setTimeout(function() {
                var sel = window.getSelection();
                if (!sel || sel.isCollapsed || !sel.toString().trim()) {
                    menu.style.display = 'none';
                    return;
                }
                var range = sel.getRangeAt(0);
                if (!content.contains(range.startContainer)) {
                    menu.style.display = 'none';
                    return;
                }
                var rect = range.getBoundingClientRect();
                menu.style.display = 'flex';
                var left = rect.left + rect.width / 2;
                var top = rect.top + window.scrollY - menu.offsetHeight - 12;
                left = Math.max(menu.offsetWidth / 2 + 8, Math.min(left, window.innerWidth - menu.offsetWidth / 2 - 8));
                menu.style.left = left + 'px';
                menu.style.top = top + 'px';
            }, 10);
        });

        document.addEventListener('mousedown', function(e) {
            if (!menu.contains(e.target)) menu.style.display = 'none';
        });

        document.getElementById('sel-copy').addEventListener('click', function() {
            navigator.clipboard.writeText(window.getSelection().toString());
            menu.style.display = 'none';
        });

        document.getElementById('sel-share-x').addEventListener('click', function() {
            var text = window.getSelection().toString();
            window.open('https://x.com/intent/tweet?text=' + encodeURIComponent('"' + text + '" — ' + window.location.href), '_blank');
            menu.style.display = 'none';
        });
    }

    taxonomy_name();
    defaultCheckMembership();
    assignTagClasses();
    initFooterShare();
    load_more_posts();
    responsiveTable();
    addNotProseClass();
    initLightBox();
    copy_link();
    trex_tooltip();
    trending_tags();
    tag_section();
    createResponsiveNavigation();
    function buildToC() {
        if (document.getElementById('page-gate-overlay')) return;
        var content = document.querySelector('.post-content');
        if (!content) return;

        var headings = Array.from(content.querySelectorAll('h2, h3'));
        if (headings.length < 3) return;

        headings.forEach(function(h, i) {
            if (!h.id) {
                h.id = 'toc-' + i + '-' + h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
            }
        });

        var toc = document.createElement('nav');
        toc.id = 'toc';
        toc.setAttribute('aria-label', 'Table of contents');

        var title = document.createElement('p');
        title.className = 'toc-title';
        title.textContent = 'Contents';
        toc.appendChild(title);

        var list = document.createElement('ol');
        list.className = 'toc-list';

        headings.forEach(function(h) {
            var item = document.createElement('li');
            item.className = 'toc-item toc-' + h.tagName.toLowerCase();
            var link = document.createElement('a');
            link.href = '#' + h.id;
            link.textContent = h.textContent;
            link.className = 'toc-link';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById(h.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            item.appendChild(link);
            list.appendChild(item);
        });

        toc.appendChild(list);
        document.body.appendChild(toc);

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        toc.querySelectorAll('.toc-link').forEach(function(l) { l.classList.remove('toc-active'); });
                        var active = toc.querySelector('a[href="#' + entry.target.id + '"]');
                        if (active) active.classList.add('toc-active');
                    }
                });
            }, { rootMargin: '-10% 0px -75% 0px' });

            headings.forEach(function(h) { observer.observe(h); });
        }
    }

    function returnHook() {
        if (!document.body.classList.contains('home-template')) return;
        var apiKey = window.GHOST_CONTENT_API_KEY;
        if (!apiKey) return;

        var lastVisit = localStorage.getItem('uxarena_last_visit');
        var now = new Date().toISOString();

        if (lastVisit) {
            fetch('https://uxarena.net/ghost/api/content/posts/?key=' + apiKey +
                '&filter=published_at:%3E' + encodeURIComponent(lastVisit) +
                '&limit=all&fields=id')
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    var count = data.posts ? data.posts.length : 0;
                    if (count > 0) {
                        var hook = document.createElement('div');
                        hook.className = 'return-hook';
                        hook.textContent = count + ' new ' + (count === 1 ? 'argument' : 'arguments') + ' since your last visit.';
                        var subscribeBox = document.getElementById('subscribe-box');
                        if (subscribeBox && subscribeBox.parentNode) {
                            subscribeBox.parentNode.insertBefore(hook, subscribeBox.nextSibling);
                        }
                    }
                })
                .catch(function() {});
        }

        localStorage.setItem('uxarena_last_visit', now);
    }

    function saveReadingProgress() {
        if (!document.body.classList.contains('post-template')) return;
        var scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                var total = document.body.scrollHeight - window.innerHeight;
                if (total <= 0) return;
                var pct = Math.round((window.scrollY / total) * 100);
                if (pct > 10 && pct < 90) {
                    localStorage.setItem('uxarena_continue_url', window.location.href);
                    localStorage.setItem('uxarena_continue_title', document.title.replace(/\s*[-|]\s*UX ARENA.*/i, '').trim());
                    localStorage.setItem('uxarena_continue_pct', pct);
                } else if (pct >= 90) {
                    localStorage.removeItem('uxarena_continue_url');
                    localStorage.removeItem('uxarena_continue_title');
                    localStorage.removeItem('uxarena_continue_pct');
                }
            }, 300);
        }, { passive: true });
    }

    function continueReadingPrompt() {
        if (!document.body.classList.contains('home-template')) return;
        var url = localStorage.getItem('uxarena_continue_url');
        var title = localStorage.getItem('uxarena_continue_title');
        var pct = localStorage.getItem('uxarena_continue_pct');
        if (!url || !title) return;

        var prompt = document.createElement('div');
        prompt.className = 'continue-reading-prompt ux-arena_container_small';
        prompt.innerHTML =
            '<span class="continue-label">Continue reading</span>' +
            '<a href="' + url + '" class="continue-link">' + title + '</a>' +
            '<span class="continue-pct">' + pct + '% through</span>' +
            '<button class="continue-dismiss" aria-label="Dismiss">×</button>';

        prompt.querySelector('.continue-dismiss').addEventListener('click', function() {
            localStorage.removeItem('uxarena_continue_url');
            localStorage.removeItem('uxarena_continue_title');
            localStorage.removeItem('uxarena_continue_pct');
            prompt.remove();
        });

        var main = document.getElementById('trex_main');
        if (main) main.insertBefore(prompt, main.firstChild);
    }

    fixCommentsCtaColors();
    watchGhostStyles();
    readingProgress();
    readerControls();
    textSelectionMenu();
    buildToC();
    returnHook();
    saveReadingProgress();
    continueReadingPrompt();
});
