import { mcpClient } from './src/clients/mcp-client.js';
import { logger } from './src/utils/logger.js';

async function testMobileLayout() {
    try {
        logger.info('Test', 'Connecting to MCP...');
        await mcpClient.connect();
        logger.info('Test', 'Connected!');

        // 1. Select Page
        logger.info('Test', 'Selecting page 0...');
        await mcpClient.callTool('select_page', { pageIdx: 0 });

        // 2. Navigate to Dashboard
        logger.info('Test', 'Navigating to Dashboard...');
        await mcpClient.callTool('navigate_page', {
            url: 'http://localhost:5173/'
        });

        // 3. Resize to Mobile Viewport
        logger.info('Test', 'Resizing to mobile (375x812)...');
        await mcpClient.callTool('resize_page', {
            width: 375,
            height: 812
        });

        // 4. Check for Burger Menu
        logger.info('Test', 'Checking for Burger menu...');
        const checkBurgerScript = `() => {
            const burger = document.querySelector('.mantine-Burger-root');
            if (burger) {
                const style = window.getComputedStyle(burger);
                return {
                    found: true,
                    display: style.display,
                    visibility: style.visibility
                };
            }
            return { found: false };
        }`;

        const result = await mcpClient.callTool('evaluate_script', {
            function: checkBurgerScript
        });

        logger.info('Test', `Burger Menu Check: ${JSON.stringify(result)}`);

        // 5. Take Screenshot
        logger.info('Test', 'Taking mobile screenshot...');
        await mcpClient.callTool('take_screenshot', {
            format: 'png',
            filePath: 'mobile-layout.png'
        });

        await mcpClient.disconnect();
        process.exit(0);

    } catch (error) {
        logger.error('Test', 'Failed', error);
        process.exit(1);
    }
}

testMobileLayout();
