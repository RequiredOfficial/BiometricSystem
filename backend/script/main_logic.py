# pip install -r requirements.txt

import face_recognition
import cv2
import numpy as np

# Загружаем фото
name_image = face_recognition.load_image_file("Картинка с расширением")


# Распознаем
name_encoding = face_recognition.face_encodings(name_image)[0]


# Списки известных лиц и их имен
known_encodings = [
    name_encoding,
]

known_names = [
    "Имя (На английском)",
]

video_capture = cv2.VideoCapture(0)
print("Нажмите 'q' для выхода")

while True:
    # Читаем кадр
    ret, frame = video_capture.read()
    # Уменьшаем кадр в 4 раза
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    # Кадр в черно белое
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    # Находим лица в уменьшенном кадре
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
    # Проверям лица
    for face_encoding, face_location in zip(face_encodings, face_locations):
        # Сравниваем
        matches = face_recognition.compare_faces(known_encodings, face_encoding)
        name = "Unknown"

        # Находим наиболее похожее лицо
        face_distances = face_recognition.face_distance(known_encodings, face_encoding)
        if len(face_distances) > 0:
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_names[best_match_index]

        # Обратно увеличиваем кадр в 4 раза
        top, right, bottom, left = face_location
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Цвет рамки
        color = (0, 0, 255)
        if name != "Unknown":
            color = (0, 255, 0)

        # Рамка вокруг лица
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        # Прямоугольник для имени
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
        # Имя
        cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

video_capture.release()
cv2.destroyAllWindows()
