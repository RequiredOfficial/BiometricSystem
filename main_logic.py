# pip install -r requirements.txt
# pip install pillow

import os
import face_recognition
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

print("Текущая папка:", os.getcwd())

#функция для руссификации текста(иначе никак)
def put_rus_text(img, text, position, font_size=20, color=(255, 255, 255)):
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    draw = ImageDraw.Draw(pil_img)
    
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
    
    draw.text(position, text, font=font, fill=color)
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

# база данных(заглушка)
people_info = {
    "John": {
        "name": "Джон",
        "job": "Разработчик",
        "phone": "+7 999 123-45-67"
    }
}

# Загружаем фото(неясно на счет расширения мб любое)
name_image = face_recognition.load_image_file("John.jpg")
# Распознаём лицо
name_encoding = face_recognition.face_encodings(name_image)[0]

known_encodings = [name_encoding]
known_names = ["Nothing"]

# Переменные
selected_person = None
show_details = False
current_faces = []
admin_mode = False

def mouse_click(event, x, y, flags, param):
    global selected_person, show_details
    if event == cv2.EVENT_LBUTTONDOWN:
        for face_location, name in current_faces:
            top, right, bottom, left = face_location
            if left <= x <= right and top <= y <= bottom:
                selected_person = name
                show_details = True
                print(f"Выбран: {name}")
                break


video_capture = cv2.VideoCapture(0)
# Создание окна и привязка обработчика клика к нему
cv2.namedWindow("Face Recognition")
cv2.setMouseCallback("Face Recognition", mouse_click)

print("="*50)
print("'A' - АДМИН ПАНЕЛЬ")
print("'Q' - выход")
print("'H' - скрыть информацию")
print("="*50)

while True:
    ret, frame = video_capture.read()
    if not ret:
        break
    
    current_faces = []
    
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
    
    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_encodings, face_encoding)
        name = "Unknown"
        
        if len(known_encodings) > 0:
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_names[best_match_index]
        
        top, right, bottom, left = [x*4 for x in face_location]
        current_faces.append(((top, right, bottom, left), name))
        
        color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
        cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)
    
    if show_details and selected_person and selected_person in people_info:
        info = people_info[selected_person]
        cv2.rectangle(frame, (10, 10), (400, 140), (0, 0, 0), -1)
        frame = put_rus_text(frame, f"Имя: {info['name']}", (20, 20), 20, (255, 255, 255))
        frame = put_rus_text(frame, f"Должность: {info['job']}", (20, 55), 20, (255, 255, 255))
        frame = put_rus_text(frame, f"Телефон: {info['phone']}", (20,90), 20, (255, 255, 255))
        frame = put_rus_text(frame, "Нажми H чтобы скрыть", (20, 115), 18, (200, 200, 200))
    
#админка(заглушка)
    if admin_mode:
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), (0, 0, 0), -1)
        frame = cv2.addWeighted(overlay, 0.7, frame, 0.3, 0)
        
        cv2.rectangle(frame, (200, 150), (frame.shape[1]-200, frame.shape[0]-150), (30, 30, 30), -1)
        cv2.rectangle(frame, (200, 150), (frame.shape[1]-200, frame.shape[0]-150), (0, 200, 255), 2)
        
        cv2.putText(frame, "ADMIN PANEL", (frame.shape[1]//2-100, 200), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 200, 255), 2)
        
        # русский текст в админке
        frame = put_rus_text(frame, "1 - Добавить новое лицо", (210, 210), 18, (255, 255, 255))
        frame = put_rus_text(frame, "2 - Удалить последнее лицо", (210, 240), 18, (255, 255, 255))
        frame = put_rus_text(frame, "3 - Показать всех пользователей", (210, 270), 18, (255, 255, 255))
        frame = put_rus_text(frame, "4 - Выйти из админ-панели", (210, 300), 18, (255, 255, 255))
        frame = put_rus_text(frame, "Нажми цифру для выбора действия", (210, 330), 18, (200, 200, 200))
    
    cv2.imshow("Face Recognition", frame)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        break
    elif key == ord("h"):
        show_details = False
        selected_person = None
    elif key == ord("a"):
        admin_mode = not admin_mode
        print(f"Админ-панель: {'ВКЛ' if admin_mode else 'ВЫКЛ'}")
    
    #админ панелль
    if admin_mode:
        if key == ord("1"):
            print("Функция добавления лица(Заглушка)")
        elif key == ord("2"):
            if len(known_names) > 1:
                removed = known_names.pop()
                known_encodings.pop()
                print(f"Удалён: {removed}")
            else:
                print("Нельзя удалить базового пользователя")
        elif key == ord("3"):
            print("СПИСОК ПОЛЬЗОВАТЕЛЕЙ:")
            for i, name in enumerate(known_names):
                if name in people_info:
                    info = people_info[name]
                    print(f"{i+1}. {info['name']} - {info['job']} - {info['phone']}")
                else:
                    print(f"{i+1}. {name}")
        elif key == ord("4"):
            admin_mode = False
            print("Выход из админки")

video_capture.release()
cv2.destroyAllWindows()
