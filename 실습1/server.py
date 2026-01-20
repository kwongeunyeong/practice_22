#!/usr/bin/env python3
"""
간단한 HTTP 서버로 To-Do 앱 실행
자동으로 크롬 브라우저를 열어줍니다.
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    # 현재 디렉토리를 서버 루트로 설정
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 서버가 시작되었습니다!")
            print(f"📝 크롬 브라우저가 자동으로 열립니다...")
            print(f"⏹️  서버를 중지하려면 Ctrl+C를 누르세요\n")
            
            # 크롬 브라우저로 자동 열기
            url = f"http://localhost:{PORT}"
            # 크롬 경로 시도
            chrome_paths = [
                r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                r"C:\Users\{}\AppData\Local\Google\Chrome\Application\chrome.exe".format(os.getenv('USERNAME'))
            ]
            
            chrome_found = False
            for chrome_path in chrome_paths:
                if os.path.exists(chrome_path):
                    webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))
                    webbrowser.get('chrome').open(url)
                    chrome_found = True
                    break
            
            if not chrome_found:
                # 크롬을 찾지 못하면 기본 브라우저로 열기
                webbrowser.open(url)
            
            # 서버 실행
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98 or e.errno == 48:  # Address already in use
            print(f"❌ 포트 {PORT}가 이미 사용 중입니다.")
            print(f"다른 포트를 사용하거나 기존 서버를 종료해주세요.")
        else:
            print(f"❌ 오류 발생: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n서버가 종료되었습니다.")
        sys.exit(0)

if __name__ == "__main__":
    main()
