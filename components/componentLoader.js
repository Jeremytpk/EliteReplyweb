// Component Loader Utility
// This script loads header and footer components into pages

class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
        }
    }

    static async loadHeader() {
        await this.loadComponent('header-placeholder', 'components/header.html');
    }

    static async loadFooter() {
        await this.loadComponent('footer-placeholder', 'components/footer.html');
    }

    static async loadAll() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
    }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ComponentLoader.loadAll();
});

// Export for manual use if needed
window.ComponentLoader = ComponentLoader;
