class Drawer {
    constructor() {
        // Safely get all elements
        this.drawer = document.getElementById('drawer');
        this.overlay = document.getElementById('drawerOverlay');
        this.openBtn = document.getElementById('openDrawer');
        this.closeBtn = document.getElementById('closeDrawer');
        
        // If essential elements are missing, don't initialize
        if (!this.drawer || !this.overlay || !this.openBtn) {
            return;
        }
        
        this.isOpen = false;
        
        this.init();
    }

    init() {
        // Event listeners - only add if elements exist
        this.openBtn.addEventListener('click', () => this.open());
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        this.overlay.addEventListener('click', () => this.close());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Show overlay
        this.overlay.classList.remove('hidden');
        setTimeout(() => {
            this.overlay.classList.remove('opacity-0');
            this.overlay.classList.add('opacity-100');
        }, 10);
        
        // Show drawer
        this.drawer.classList.remove('-translate-x-full');
        this.drawer.classList.add('translate-x-0');
        
        // Focus management
        if (this.closeBtn) {
            this.closeBtn.focus();
        }
    }

    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        document.body.style.overflow = '';
        
        // Hide overlay
        this.overlay.classList.remove('opacity-100');
        this.overlay.classList.add('opacity-0');
        setTimeout(() => {
            this.overlay.classList.add('hidden');
        }, 300);
        
        // Hide drawer
        this.drawer.classList.remove('translate-x-0');
        this.drawer.classList.add('-translate-x-full');
        
        // Return focus to open button
        this.openBtn.focus();
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }
}

// Initialize drawer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Drawer();
});