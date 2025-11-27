import { mcpClient } from './src/clients/mcp-client.js';
import { logger } from './src/utils/logger.js';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testPlanGeneration() {
    try {
        logger.info('Test', 'Connecting to MCP...');
        await mcpClient.connect();
        logger.info('Test', 'Connected!');

        // 1. Select Page
        logger.info('Test', 'Listing pages...');
        const pagesResult = await mcpClient.callTool('list_pages', {});
        // Parse the result. The result content is usually a stringified JSON or text.
        // Based on SDK, the result structure is { content: [{ type: 'text', text: '...' }] }
        // We need to see the format. Assuming it returns a list of pages in the text.
        // But for now, let's just try to select page 0.

        logger.info('Test', 'Selecting page 0...');
        await mcpClient.callTool('select_page', { pageIdx: 0 });

        // 2. Navigate to Dashboard
        logger.info('Test', 'Navigating to Dashboard...');
        await mcpClient.callTool('navigate_page', {
            url: 'http://localhost:5173/'
        });

        logger.info('Test', 'Waiting for page load...');
        await sleep(3000);

        // 3. Check for "Generate Today's Plan" button
        logger.info('Test', 'Looking for Generate button...');
        const findButtonScript = `() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const genBtn = buttons.find(b => b.textContent.includes("Generate Today's Plan") || b.textContent.includes("Regenerate Plan"));
            if (genBtn) {
                genBtn.click();
                return "Clicked";
            }
            return "Button not found";
        }`;

        const result = await mcpClient.callTool('evaluate_script', {
            function: findButtonScript
        });

        logger.info('Test', `Button interaction result: ${JSON.stringify(result)}`);

        // Check if result content contains "Button not found"
        // The result.content[0].text will contain the return value of the script (JSON stringified usually)
        if (JSON.stringify(result).includes("Button not found")) {
            logger.error('Test', 'Could not find generate button. Are we logged in? Is the page loaded?');

            // Log body HTML and URL
            const debugInfo = await mcpClient.callTool('evaluate_script', {
                function: '() => ({ url: window.location.href, html: document.body.innerHTML })'
            });
            logger.info('Test', `Debug Info: ${JSON.stringify(debugInfo)}`);

            await mcpClient.callTool('take_screenshot', {
                format: 'png',
                filePath: 'debug-screenshot.png'
            });
            process.exit(1);
        }

        // 4. Wait for plan generation
        logger.info('Test', 'Waiting for plan generation (10s)...');
        await sleep(10000);

        // 5. Verify Plan Content
        logger.info('Test', 'Verifying generated plan...');
        const verifyScript = `() => {
            const cards = Array.from(document.querySelectorAll('.mantine-Card-root'));
            const actions = cards.map(c => {
                const title = c.querySelector('.mantine-Text-root[style*="font-weight: 600"]')?.textContent;
                return title;
            }).filter(t => t);
            return actions;
        }`;

        const planResult = await mcpClient.callTool('evaluate_script', {
            function: verifyScript
        });

        logger.info('Test', `Generated Plan Items: ${planResult.content[0].text}`);

        await mcpClient.disconnect();
        process.exit(0);

    } catch (error) {
        logger.error('Test', 'Failed', error);
        process.exit(1);
    }
}

testPlanGeneration();
