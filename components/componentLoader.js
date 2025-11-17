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
                
                // Execute scripts in the loaded HTML
                const scripts = element.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    // Copy any attributes
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
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

    // Data button logic
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'data-btn') {
            const pass = prompt('Entrez le code d\'accès:');
            if (pass === 'ER2024') {
                window.location.href = 'analytics.html';
            } else if (pass !== null) {
                alert('Code incorrect.');
            }
        }
    });
});

// Export for manual use if needed
window.ComponentLoader = ComponentLoader;
