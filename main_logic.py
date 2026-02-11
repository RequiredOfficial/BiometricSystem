# pip install -r requirements.txt
# pip install pillow

import os
import face_recognition
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import sqlite3
import pickle
from datetime import datetime

def init_db():
    conn = sqlite3.connect('face_recognition.db')
    cursor = conn.cursor()
    
    # Таблица persons - люди
    cursor.execute('''CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        job TEXT,
        phone TEXT,
        created TEXT DEFAULT CURRENT_TIMESTAMP,
        isactive INTEGER DEFAULT 1
    )''')
    
    # Таблица faces - лица
    cursor.execute('''CREATE TABLE IF NOT EXISTS faces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        persID INTEGER,
        faceatt BLOB,
        img TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        conf REAL DEFAULT 1.0,
        verified INTEGER DEFAULT 1,
        FOREIGN KEY (persID) REFERENCES persons(id)
    )''')
    
    conn.commit()
    conn.close()
    print(" БД создана")

def load_all_faces():
    conn = sqlite3.connect('face_recognition.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.id, p.name, p.surname, p.job, p.phone, f.faceatt 
        FROM persons p
        JOIN faces f ON p.id = f.persID
        WHERE p.isactive = 1
    ''')
    
    encodings = []
    names = []
    people_info = {}
    
    for persID, name, surname, job, phone, face_blob in cursor.fetchall():
        if face_blob:
            encoding = pickle.loads(face_blob)
            encodings.append(encoding)

            eng_name = f"{name}_{surname}"
            names.append(eng_name)
            
            people_info[eng_name] = {
                "name": f"{name} {surname}",
                "job": job if job else "Сотрудник",
                "phone": phone if phone else "+7 XXX XXX-XX-XX"
            }
    
    conn.close()
    return encodings, names, people_info

def add_person_to_db(name, surname, face_encoding, image_path, job="", phone=""):
    conn = sqlite3.connect('face_recognition.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO persons (name, surname, job, phone, created, isactive) 
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, surname, job, phone, datetime.now(), 1))
    
    persID = cursor.lastrowid
    
    face_blob = pickle.dumps(face_encoding)
    cursor.execute('''
        INSERT INTO faces (persID, faceatt, img, timestamp, verified) 
        VALUES (?, ?, ?, ?, ?)
    ''', (persID, face_blob, image_path, datetime.now(), 1))
    
    conn.commit()
    conn.close()
    return persID

def delete_person(eng_name):
    name_parts = eng_name.split('_')
    if len(name_parts) == 2:
        name, surname = name_parts
    else:
        name = eng_name
        surname = ""
    
    conn = sqlite3.connect('face_recognition.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE persons SET isactive = 0 
        WHERE name = ? AND surname = ?
    ''', (name, surname))
    
    conn.commit()
    conn.close()


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

def main():
    init_db()
    
    known_encodings, known_names, people_info = load_all_faces()
    
    if not known_encodings:
        print("База пуста. Добавьте пользователей через админ-панель")
        print("Нажмите 'a' для входа в админ-панель")
    
    selected_person = None
    show_details = False
    current_faces = []
    admin_mode = False
    
    def mouse_click(event, x, y, flags, param):
        nonlocal selected_person, show_details
        if event == cv2.EVENT_LBUTTONDOWN:
            for face_location, name in current_faces:
                top, right, bottom, left = face_location
                if left <= x <= right and top <= y <= bottom:
                    selected_person = name
                    show_details = True
                    print(f"Выбран: {name}")
                    break
    
    video_capture = cv2.VideoCapture(0)
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
            frame = put_rus_text(frame, f"Телефон: {info['phone']}", (20, 90), 20, (255, 255, 255))
            frame = put_rus_text(frame, "Нажми H чтобы скрыть", (20, 115), 18, (200, 200, 200))
        
        if admin_mode:
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), (0, 0, 0), -1)
            frame = cv2.addWeighted(overlay, 0.7, frame, 0.3, 0)
            
            cv2.rectangle(frame, (200, 150), (frame.shape[1]-200, frame.shape[0]-150), (30, 30, 30), -1)
            cv2.rectangle(frame, (200, 150), (frame.shape[1]-200, frame.shape[0]-150), (0, 200, 255), 2)
            
            cv2.putText(frame, "ADMIN PANEL", (frame.shape[1]//2-100, 200), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 200, 255), 2)
            
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
        
        if admin_mode:
            if key == ord("1"):
                image_path = input("Путь к фото: ")
                
                try:
                    image = face_recognition.load_image_file(image_path)
                    encodings = face_recognition.face_encodings(image)
                    
                    if encodings:
                        name = input("Имя: ")
                        surname = input("Фамилия: ")
                        job = input("Должность: ")
                        phone = input("Телефон: ")
                        
                        persID = add_person_to_db(name, surname, encodings[0], image_path, job, phone)
                        
                        known_encodings, known_names, people_info = load_all_faces()
                        print(f"{name} {surname} добавлен ID: {persID}")
                    else:
                        print("Лицо не найдено на фото")
                except Exception as e:
                    print(f"Ошибка: {e}")
            
            elif key == ord("2"):
                if len(known_names) > 0:
                    removed = known_names[-1]
                    delete_person(removed)
                    known_encodings, known_names, people_info = load_all_faces()
                    print(f"Удалён: {removed}")
                else:
                    print("Нет пользователей для удаления")
            
            elif key == ord("3"):
                print("\n Пользователи")
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

if __name__ == "__main__":
    main()
