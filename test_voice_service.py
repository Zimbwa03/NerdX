import asyncio
import os
from services.voice_service import get_voice_service

async def test_voice_flow():
    print("="*60)
    print("VOICE SERVICE TEST")
    print("="*60)
    
    service = get_voice_service()
    
    # 1. Test TTS
    print("\n[TEST] Text-to-Speech (Edge-TTS)...")
    text = "Hello, this is a test of the NerdX voice system."
    tts_result = await service.text_to_speech(text)
    
    if tts_result['success']:
        print(f"[OK] TTS successful: {tts_result['audio_path']}")
        audio_file = tts_result['full_path']
    else:
        print(f"[FAIL] TTS failed: {tts_result.get('error')}")
        return

    # 2. Test STT (Transcribe the generated audio)
    print("\n[TEST] Speech-to-Text (Whisper)...")
    # Note: Whisper might take a moment to load the model
    stt_result = service.transcribe_audio(audio_file)
    
    if 'error' in stt_result:
        print(f"[FAIL] STT failed: {stt_result['error']}")
    else:
        print(f"[OK] STT successful")
        print(f"Original: '{text}'")
        print(f"Transcribed: '{stt_result['text']}'")
        print(f"Language: {stt_result['language']}")
        
        # Simple verification
        if "NerdX" in stt_result['text'] or "voice system" in stt_result['text']:
             print("[PASS] Transcription matches content!")
        else:
             print("[WARN] Transcription might be inaccurate.")

    print("\n" + "="*60)
    print("TEST COMPLETE")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(test_voice_flow())
