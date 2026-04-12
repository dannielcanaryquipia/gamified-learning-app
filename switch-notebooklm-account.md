# Switch NotebookLM Account

## 1. Remove Current Authentication
Remove-Item "C:\Users\Danniel Canary\.notebooklm-mcp\auth.json" -Force

## 2. Clear Chrome Profile (Optional)
Remove-Item "C:\Users\Danniel Canary\AppData\Local\notebooklm-mcp\Data" -Recurse -Force

## 3. Re-authenticate
npx -y notebooklm-mcp@latest login

## 4. Restart Windsurf

## 5. Verify New Account
@notebooklm who am I
