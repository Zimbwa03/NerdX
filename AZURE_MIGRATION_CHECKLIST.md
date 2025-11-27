# Render to Azure Migration Checklist

Use this checklist to ensure a smooth migration from Render to Azure.

---

## Pre-Migration

### 1. Backup Everything
- [ ] Export all environment variables from Render
- [ ] Document current Render configuration
- [ ] Backup database (if not using Supabase)
- [ ] Note current app URL for reference

### 2. Gather Credentials
- [ ] DeepSeek API Key
- [ ] Gemini API Key
- [ ] Supabase URL
- [ ] Supabase Service Role Key
- [ ] Database URL
- [ ] JWT Secret
- [ ] Session Secret
- [ ] Any other API keys

### 3. Prepare Azure Account
- [ ] Verify Azure student account is active
- [ ] Check available credits ($100 for students)
- [ ] Install Azure CLI (optional but recommended)
- [ ] Login to Azure Portal

---

## Migration Steps

### Phase 1: Azure Setup
- [ ] Create Resource Group (`nerdx-rg`)
- [ ] Create App Service Plan (F1 Free tier)
- [ ] Create Web App (Python 3.13)
- [ ] Note down app URL: `https://[your-app-name].azurewebsites.net`

### Phase 2: Configuration
- [ ] Add all environment variables in Azure App Settings
- [ ] Configure startup command
- [ ] Enable build during deployment
- [ ] Enable logging

### Phase 3: Deployment
- [ ] Choose deployment method:
  - [ ] Option A: GitHub (recommended)
  - [ ] Option B: Local Git
  - [ ] Option C: Azure CLI
- [ ] Push code to Azure
- [ ] Monitor deployment logs
- [ ] Wait for build to complete

### Phase 4: Verification
- [ ] Test health endpoint: `/health`
- [ ] Check application logs
- [ ] Test main features:
  - [ ] User registration
  - [ ] Login
  - [ ] Quiz generation
  - [ ] API endpoints
- [ ] Verify database connectivity
- [ ] Test mobile app connection (if applicable)

---

## Post-Migration

### 1. Update External Services
- [ ] Update mobile app API endpoint
- [ ] Update any webhooks pointing to old URL
- [ ] Update DNS if using custom domain
- [ ] Update documentation with new URL

### 2. Monitor Performance
- [ ] Set up Application Insights (optional)
- [ ] Enable diagnostic logging
- [ ] Set up budget alerts
- [ ] Monitor resource usage

### 3. Optimize (Optional)
- [ ] Review performance metrics
- [ ] Consider upgrading from F1 if needed
- [ ] Set up auto-scaling (B1+ tier)
- [ ] Configure CDN for static files

---

## Rollback Plan (If Needed)

If something goes wrong, you can quickly rollback:

### Keep Render Active
- [ ] Don't delete Render app immediately
- [ ] Keep it running for 1-2 weeks
- [ ] Monitor Azure performance
- [ ] Only delete Render after confirming Azure works

### Quick Rollback Steps
1. Update mobile app to point back to Render URL
2. Restore any changed webhooks
3. Continue using Render while debugging Azure

---

## Decommission Render

**Only after Azure is stable for 1-2 weeks:**

- [ ] Download final logs from Render
- [ ] Cancel Render subscription
- [ ] Delete Render service
- [ ] Update all documentation

---

## Troubleshooting Checklist

### App Won't Start
- [ ] Check logs in Azure Portal
- [ ] Verify all environment variables are set
- [ ] Confirm startup command is correct
- [ ] Check Python version matches (3.13)

### Database Connection Issues
- [ ] Verify DATABASE_URL is correct
- [ ] Check Supabase allows Azure IPs
- [ ] Test connection from Azure SSH

### Module Not Found
- [ ] Verify requirements.txt is in root
- [ ] Check SCM_DO_BUILD_DURING_DEPLOYMENT=true
- [ ] Review build logs

### Timeout Issues
- [ ] Increase timeout in startup command
- [ ] Check for heavy initialization
- [ ] Review lazy loading implementation

---

## Cost Monitoring

### Weekly Checks
- [ ] Check Azure credit balance
- [ ] Review resource usage
- [ ] Monitor bandwidth consumption
- [ ] Check for unexpected charges

### Monthly Review
- [ ] Analyze cost trends
- [ ] Optimize resource usage
- [ ] Consider tier adjustments
- [ ] Review budget alerts

---

## Success Criteria

Your migration is successful when:

- ✅ App is accessible at Azure URL
- ✅ Health endpoint returns 200 OK
- ✅ All features work as expected
- ✅ Database connections are stable
- ✅ Mobile app connects successfully
- ✅ Logs show no critical errors
- ✅ Performance is acceptable
- ✅ Costs are within budget

---

## Timeline Estimate

| Phase | Estimated Time |
|-------|----------------|
| Pre-Migration | 30 minutes |
| Azure Setup | 15 minutes |
| Configuration | 20 minutes |
| Deployment | 30-60 minutes |
| Verification | 30 minutes |
| **Total** | **2-3 hours** |

---

## Need Help?

**Common Issues:**
- See [AZURE_DEPLOYMENT_GUIDE.md](./AZURE_DEPLOYMENT_GUIDE.md) for detailed troubleshooting
- Check [AZURE_QUICK_START.md](./AZURE_QUICK_START.md) for quick commands

**Resources:**
- Azure Support (included with student account)
- Azure Documentation: https://docs.microsoft.com/azure
- Community Forums: https://stackoverflow.com/questions/tagged/azure

---

> [!TIP]
> **Pro Tip:** Do the migration during low-traffic hours to minimize impact on users!

> [!IMPORTANT]
> **Remember:** Keep Render running until you're 100% confident Azure is working perfectly!
