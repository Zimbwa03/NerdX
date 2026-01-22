import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from services.whatsapp_template_service import WhatsAppTemplateService

class _DummyWhatsAppService:
    def send_message(self, *args, **kwargs):
        return True

def main() -> int:
    service = WhatsAppTemplateService(_DummyWhatsAppService())
    issues = service.get_template_compliance_issues()
    if not issues:
        print("OK: No compliance issues found in WhatsApp templates.")
        return 0

    print("Compliance issues detected:")
    for name, problems in sorted(issues.items()):
        for problem in problems:
            print(f"- {name}: {problem}")
    return 1

if __name__ == "__main__":
    sys.exit(main())
