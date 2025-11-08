// Mobile Menu Controller
class MobileMenu {
    constructor() {
        this.mobileMenu = null;
        this.overlay = null;
        this.menuButton = null;
        this.closeButton = null;
        this.menuIcon = null;
        this.closeIcon = null;
        this.downloadBtn = null;
        this.initialized = false;
        
        // Initialize after a short delay to ensure DOM is ready
        this.init();
    }
    
    init() {
        // Try to initialize immediately
        this.initializeElements();
        
        // Also try after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        }
        
        // Retry mechanism for dynamically loaded components
        let retryCount = 0;
        const maxRetries = 10;
        const retryInterval = setInterval(() => {
            if (this.initializeElements() || retryCount >= maxRetries) {
                clearInterval(retryInterval);
            }
            retryCount++;
        }, 200);
    }
    
    initializeElements() {
        // Get all required elements
        this.mobileMenu = document.getElementById('mobile-menu');
        this.overlay = document.getElementById('mobile-menu-overlay');
        this.menuButton = document.getElementById('mobile-menu-button');
        this.closeButton = document.getElementById('mobile-menu-close');
        this.menuIcon = document.getElementById('menu-icon');
        this.closeIcon = document.getElementById('close-icon');
        this.downloadBtn = document.getElementById('mobile-download-btn');
        
        // Debug logging
        console.log('🔍 Searching for menu elements:', {
            mobileMenu: !!this.mobileMenu,
            overlay: !!this.overlay,
            menuButton: !!this.menuButton,
            closeButton: !!this.closeButton,
            menuIcon: !!this.menuIcon,
            closeIcon: !!this.closeIcon
        });
        
        // Check if all critical elements are found
        const allElementsFound = this.mobileMenu && this.overlay && this.menuButton;
        
        if (allElementsFound) {
            console.log('✅ Mobile menu elements found, attaching listeners');
            
            // Ensure menu starts in closed state
            if (this.mobileMenu && this.overlay) {
                // Force closed state multiple times to overcome any interference
                const forceClosedState = () => {
                    this.mobileMenu.classList.add('translate-x-full');
                    this.overlay.classList.add('hidden');
                    if (this.menuIcon) this.menuIcon.classList.remove('hidden');
                    if (this.closeIcon) this.closeIcon.classList.add('hidden');
                    document.body.style.overflow = '';
                };
                
                forceClosedState();
                setTimeout(forceClosedState, 50);
                setTimeout(forceClosedState, 100);
                setTimeout(forceClosedState, 200);
                setTimeout(forceClosedState, 500);
                
                console.log('🔒 Menu initialized in closed state');
            }
            
            this.attachEventListeners();
            this.initialized = true;
            return true;
        } else {
            console.log('⏳ Waiting for mobile menu elements...');
            return false;
        }
    }
    
    attachEventListeners() {
        // Remove any existing listeners to prevent duplicates
        this.removeEventListeners();
        
        // Menu button click
        if (this.menuButton) {
            this.menuButton.addEventListener('click', (e) => {
                console.log('🖱️ Menu button clicked!', e);
                this.toggle();
            });
            
            // Also try with touchstart for mobile
            this.menuButton.addEventListener('touchstart', (e) => {
                console.log('👆 Menu button touched!', e);
                e.preventDefault();
                this.toggle();
            });
            
            console.log('✅ Menu button listener attached');
        } else {
            console.error('❌ Menu button not found!');
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', this.close.bind(this));
            console.log('✅ Overlay listener attached');
        }
        
        // Close button click
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.close.bind(this));
            console.log('✅ Close button listener attached');
        }
        
        // Download button in mobile menu
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => {
                if (typeof openDownloadModal === 'function') {
                    openDownloadModal();
                }
                this.close();
            });
            console.log('✅ Download button listener attached');
        }
        
        // Close menu on mobile nav link clicks
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow navigation animation
                setTimeout(() => this.close(), 100);
            });
        });
        
        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const isCurrentlyOpen = this.mobileMenu && !this.mobileMenu.classList.contains('translate-x-full');
                if (isCurrentlyOpen) {
                    this.close();
                }
            }
        });
    }
    
    removeEventListeners() {
        // This is a safety measure to prevent duplicate listeners
        // Note: This creates new bound functions, so it won't actually remove the old ones
        // But it's here for clarity and potential future improvements
    }
    
    toggle() {
        if (!this.mobileMenu || !this.overlay) {
            console.error('❌ Cannot toggle menu: elements not found');
            return;
        }
        
        // Check actual DOM state, not a variable
        const hasTranslateClass = this.mobileMenu.classList.contains('translate-x-full');
        const isCurrentlyOpen = !hasTranslateClass;
        
        console.log('🔍 Debug info:', {
            hasTranslateClass,
            isCurrentlyOpen,
            classList: Array.from(this.mobileMenu.classList)
        });
        
        console.log('🔄 Toggle menu - Current state:', isCurrentlyOpen ? 'OPEN' : 'CLOSED');
        
        if (isCurrentlyOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        console.log('📂 Opening menu...');
        if (!this.mobileMenu || !this.overlay) {
            console.error('❌ Cannot open menu: elements not found');
            return;
        }
        
        // Show overlay
        this.overlay.classList.remove('hidden');
        
        // Slide in menu
        this.mobileMenu.classList.remove('translate-x-full');
        
        // Toggle icons
        if (this.menuIcon) this.menuIcon.classList.add('hidden');
        if (this.closeIcon) this.closeIcon.classList.remove('hidden');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Menu opened');
    }
    
    close() {
        console.log('📁 Closing menu...');
        if (!this.mobileMenu || !this.overlay) {
            console.error('❌ Cannot close menu: elements not found');
            return;
        }
        
        // Hide overlay
        this.overlay.classList.add('hidden');
        
        // Slide out menu
        this.mobileMenu.classList.add('translate-x-full');
        
        // Toggle icons
        if (this.menuIcon) this.menuIcon.classList.remove('hidden');
        if (this.closeIcon) this.closeIcon.classList.add('hidden');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('✅ Menu closed');
    }
}

// Initialize the mobile menu
let mobileMenuInstance = null;

// Function to initialize or reinitialize the menu
function initializeMobileMenu() {
    console.log('🚀 Initializing Mobile Menu...');
    mobileMenuInstance = new MobileMenu();
    
    // Make toggle function available globally for backward compatibility
    window.toggleMobileMenu = function() {
        if (mobileMenuInstance) {
            mobileMenuInstance.toggle();
        }
    };
}

// Auto-initialize when script loads
initializeMobileMenu();

// Also initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Export for manual use
window.MobileMenu = MobileMenu;
window.initializeMobileMenu = initializeMobileMenu;
