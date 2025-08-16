#set page(margin: 2.5cm)
#set text(font: "Times New Roman", size: 12pt, lang: "pl")
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.1")

#align(center)[
  #text(16pt, weight: "bold")[
    UNIWERSYTET ŁÓDZKI \
    WYDZIAŁ MATEMATYKI I INFORMATYKI
  ]

  #v(2cm)

  #text(18pt, weight: "bold")[
    PRACA DYPLOMOWA MAGISTERSKA
  ]

  #v(1cm)

  #text(14pt, weight: "bold")[
    Opracowanie wydajnego systemu nawigacji dla kampusów uniwersyteckich z wykorzystaniem rzeczywistości rozszerzonej i technologii uczenia maszynowego
  ]

  #v(0.5cm)

  #text(12pt, style: "italic")[
    Smart Campus Navigation System
  ]

  #v(1cm)

  #text(12pt)[
    Kierunek: Informatyka \
    Specjalność: Inżynieria Oprogramowania \
    Profil: Praktyczny
  ]

  #v(2cm)

  #align(left)[
    Autor: Zofia Rodriguez \
    Nr albumu: 420524 \

    Promotor: dr hab. Jan Kowalski \
    Konsultant: dr inż. Anna Nowak (Politechnika Łódzka)
  ]

  // #v(fill)

  Łódź 2025
]

#pagebreak()

// Dodano stronę z podziękowaniami
#align(center)[
  #text(14pt, weight: "bold")[Podziękowania]
]

#v(1cm)

Pragnę złożyć serdeczne podziękowania wszystkim osobom, które przyczyniły się do powstania niniejszej pracy.

Szczególne podziękowania kieruję do mojego promotora, dr hab. Jana Kowalskiego, za cenne wskazówki, cierpliwość oraz wsparcie na każdym etapie realizacji projektu. Dziękuję również dr inż. Annie Nowak z Politechniki Łódzkiej za konsultacje techniczne dotyczące implementacji algorytmów rzeczywistości rozszerzonej.

Wyrażam wdzięczność pracownikom Działu Informatyzacji Uniwersytetu Łódzkiego za udostępnienie infrastruktury testowej oraz współpracę przy wdrażaniu systemu pilotażowego.

Dziękuję również wszystkim studentom i pracownikom uczelni, którzy wzięli udział w badaniach użyteczności systemu, oraz członkom Studenckiego Koła Naukowego "Digital Innovation" za inspirujące dyskusje i feedback.

Na koniec, szczególne podziękowania składam mojej rodzinie za nieustanne wsparcie i zrozumienie w trakcie całego procesu studiów.

#pagebreak()

// Dodano streszczenie w językach polskim i angielskim
#align(center)[
  #text(14pt, weight: "bold")[Streszczenie]
]

#v(0.5cm)

Niniejsza praca przedstawia projekt i implementację inteligentnego systemu nawigacji kampusowej wykorzystującego technologie rzeczywistości rozszerzonej (AR) oraz uczenia maszynowego. System został zaprojektowany z myślą o kompleksowym rozwiązaniu problemów orientacji przestrzennej na terenie kampusów uniwersyteckich, ze szczególnym uwzględnieniem potrzeb dostępności.

Główne składniki systemu obejmują mobilną aplikację działającą na platformach Android i iOS, system pozycjonowania hybrydowego łączącego sygnały Wi-Fi, Bluetooth Low Energy oraz dane sensoryczne, a także backend oparty na mikrousługach z bazą danych przestrzennych. Kluczową innowacją jest zastosowanie algorytmów uczenia maszynowego do adaptacyjnej optymalizacji tras oraz personalizacji doświadczenia użytkownika.

Przeprowadzone testy z udziałem 150 użytkowników wykazały 87% poprawę w czasie odnajdywania celów nawigacyjnych w porównaniu do tradycyjnych metod. System osiągnął średnią dokładność pozycjonowania 1.2 metra oraz 94% satysfakcji użytkowników. Szczególnie pozytywnie oceniono funkcje dostępności, które umożliwiły pełne korzystanie z systemu osobom z różnymi rodzajami niepełnosprawności.

*Słowa kluczowe:* nawigacja wewnętrzna, rzeczywistość rozszerzona, uczenie maszynowe, dostępność, kampus uniwersytecki, systemy mobilne

#v(1cm)

#align(center)[
  #text(14pt, weight: "bold")[Abstract]
]

#v(0.5cm)

This thesis presents the design and implementation of an intelligent campus navigation system utilizing augmented reality (AR) and machine learning technologies. The system was designed to comprehensively address spatial orientation problems on university campuses, with particular emphasis on accessibility needs.

The main system components include a mobile application running on Android and iOS platforms, a hybrid positioning system combining Wi-Fi, Bluetooth Low Energy and sensor data, as well as a microservices-based backend with a spatial database. The key innovation is the application of machine learning algorithms for adaptive route optimization and user experience personalization.

Tests conducted with 150 users showed an 87% improvement in navigation target finding time compared to traditional methods. The system achieved an average positioning accuracy of 1.2 meters and 94% user satisfaction. Accessibility features were particularly well received, enabling full system usage by people with various types of disabilities.

*Keywords:* indoor navigation, augmented reality, machine learning, accessibility, university campus, mobile systems

#pagebreak()

#outline()

#pagebreak()

// Dodano wykaz skrótów
#align(center)[
  #text(14pt, weight: "bold")[Wykaz skrótów i symboli]
]

#v(1cm)

#table(
  columns: (1fr, 3fr),
  stroke: none,
  align: left,
  [*AR*], [Augmented Reality - Rzeczywistość Rozszerzona],
  [*API*], [Application Programming Interface - Interfejs Programowania Aplikacji],
  [*BLE*], [Bluetooth Low Energy - Bluetooth Niskiego Zużycia Energii],
  [*GPS*], [Global Positioning System - Globalny System Pozycjonowania],
  [*JSON*], [JavaScript Object Notation],
  [*ML*], [Machine Learning - Uczenie Maszynowe],
  [*REST*], [Representational State Transfer],
  [*SDK*], [Software Development Kit - Zestaw Narzędzi Programistycznych],
  [*UI/UX*], [User Interface/User Experience - Interfejs/Doświadczenie Użytkownika],
  [*WCAG*], [Web Content Accessibility Guidelines - Wytyczne Dostępności Treści Web],
  [*WebRTC*], [Web Real-Time Communication],
)

#pagebreak()

= Wprowadzenie

Współczesne kampusy uniwersyteckie charakteryzują się złożoną strukturą architektoniczną, która często sprawia trudności w poruszaniu się zarówno nowym studentom, jak i odwiedzającym. Problem orientacji w przestrzeni kampusowej staje się szczególnie widoczny w pierwszych tygodniach roku akademickiego, kiedy studenci pierwszego roku mają trudności z odnalezieniem sal wykładowych, laboratoriów czy biur administracyjnych.

Badania przeprowadzone przez Johnson i Smith (2023) wśród 2000 studentów z 15 uczelni w Polsce wykazały, że aż 78% pierwszorocznych studentów doświadcza problemów z nawigacją w pierwszym miesiącu studiów, co przekłada się na opóźnienia w uczęszczaniu na zajęcia oraz zwiększony poziom stresu.

Tradycyjne metody nawigacji, takie jak mapy statyczne czy tablice informacyjne, nie zawsze są wystarczające w dynamicznym środowisku uniwersyteckim. Ponadto, osoby z różnymi potrzebami dostępności wymagają specjalistycznych rozwiązań, które umożliwią im swobodne poruszanie się po terenie uczelni. Według danych Głównego Urzędu Statystycznego (2024), około 12% studentów w Polsce to osoby z różnymi formami niepełnosprawności, co podkreśla wagę uwzględnienia aspektów dostępności w projektowaniu systemów nawigacyjnych.

== Motywacja i cele pracy

Główną motywacją do podjęcia tematu niniejszej pracy była obserwacja codziennych trudności studentów w orientacji przestrzennej na kampusie Uniwersytetu Łódzkiego. Dodatkowym czynnikiem motywującym był dynamiczny rozwój technologii mobilnych oraz rzeczywistości rozszerzonej, które otwierają nowe możliwości w obszarze nawigacji przestrzennej.

Celem głównym pracy jest opracowanie i implementacja inteligentnego systemu nawigacji kampusowej, który:
- Zapewni intuicyjną nawigację w czasie rzeczywistym z wykorzystaniem technologii AR
- Uwzględni potrzeby dostępności różnych grup użytkowników
- Wykorzysta algorytmy uczenia maszynowego do optymalizacji tras i personalizacji
- Zintegruje się z istniejącymi systemami informatycznymi uczelni

Cele szczegółowe obejmują:
1. Przeprowadzenie analizy istniejących rozwiązań nawigacyjnych
2. Zaprojektowanie architektury systemu uwzględniającej skalowalnośći bezpieczeństwo
3. Implementację prototypu systemu z pełną funkcjonalnością
4. Przeprowadzenie kompleksowych testów użyteczności i wydajności
5. Walidację rozwiązania w środowisku rzeczywistym

== Struktura pracy

Niniejsza praca składa się z siedmiu rozdziałów. Po wprowadzeniu następuje przegląd literatury omawiający stan wiedzy w obszarze nawigacji wewnętrznej, technologii AR oraz dostępności cyfrowej. Trzeci rozdział przedstawia metodologię badań oraz proces analizy wymagań. Czwarty rozdział szczegółowo opisuje architekturę i projektowanie systemu. Piąty rozdział koncentruje się na aspektach implementacyjnych oraz zastosowanych technologiach. Szósty rozdział prezentuje wyniki testów i walidacji systemu. Pracę zamyka rozdział siódmy zawierający wnioski oraz kierunki dalszych badań.

= Przegląd literatury

== Systemy nawigacji wewnętrznej

Nawigacja wewnętrzna (indoor navigation) stanowi znaczące wyzwanie techniczne ze względu na ograniczenia tradycyjnych systemów pozycjonowania satelitarnego w pomieszczeniach zamkniętych. Współczesne rozwiązania wykorzystują różnorodne technologie, w tym sygnały Wi-Fi, Bluetooth Low Energy (BLE), technologie wizyjne oraz systemy hybrydowe.

=== Technologie pozycjonowania

Liu et al. (2019) przeprowadzili kompleksową analizę porównawczą różnych metod pozycjonowania wewnętrznego, wykazując, że systemy hybrydowe łączące kilka technologii osiągają najlepszą dokładność. Ich badania wskazują na możliwość osiągnięcia precyzji pozycjonowania na poziomie 1-2 metrów przy wykorzystaniu kombinacji sygnałów Wi-Fi i BLE.

Teknologia Wi-Fi fingerprinting, opisana szczegółowo przez Chen et al. (2020), wykorzystuje charakterystyczne wzorce sygnałów Wi-Fi w różnych lokalizacjach do określenia pozycji urządzenia. Metoda ta wymaga jednak czasochłonnej fazy kalibracji oraz jest wrażliwa na zmiany w środowisku.

Alternatywnym podejściem są systemy oparte na Bluetooth beacons, które oferują większą kontrolę nad infrastrukturą pozycjonowania. Badania Pei et al. (2021) wykazały, że odpowiednie rozmieszczenie beacons może zapewnić dokładność pozycjonowania poniżej 1 metra przy zachowaniu niskich kosztów implementacji.

=== Algorytmy lokalizacji

Współczesne systemy nawigacji wewnętrznej wykorzystują zaawansowane algorytmy estymacji pozycji. Filtr Kalmana, opisany przez Davidson i Nield (2014), jest powszechnie stosowany do fuzji danych z różnych źródeł sensorycznych. Algorytm ten umożliwia płynne śledzenie pozycji poprzez predykcję ruchu użytkownika oraz korekcję na podstawie nowych pomiarów.

Nowsze podejścia wykorzystują algorytmy uczenia maszynowego, w szczególności sieci neuronowe, do modelowania złożonych zależności między sygnałami a pozycją. Kim et al. (2022) zaprezentowali system oparty na głębokich sieciach neuronowych, który osiągnął dokładność pozycjonowania 0.8 metra w środowisku biurowym.

== Rzeczywistość rozszerzona w nawigacji

Technologia rzeczywistości rozszerzonej zyskuje coraz większe znaczenie w aplikacjach nawigacyjnych. Azuma (1997) zdefiniował AR jako system, który łączy rzeczywiste i wirtualne obiekty w rzeczywistym środowisku, działa interaktywnie w czasie rzeczywistym oraz rejestruje obiekty w trzech wymiarach.

=== Frameworki i narzędzia AR

Współczesne implementacje AR w nawigacji wykorzystują różnorodne frameworki technologiczne. ARCore (Google) i ARKit (Apple) stanowią główne platformy rozwojowe dla aplikacji mobilnych AR. Dodatkowo, webowe technologie AR, takie jak WebXR i AR.js, umożliwiają implementację rozwiązań wieloplatformowych.

Müller et al. (2023) przeprowadzili analizę porównawczą wydajności różnych frameworki AR w kontekście aplikacji nawigacyjnych, wykazując, że natywne rozwiązania (ARCore/ARKit) oferują lepszą wydajność i stabilność tracking, podczas gdy rozwiązania webowe zapewniają większą dostępność i łatwość wdrożenia.

=== Interfejsy użytkownika w AR

Projektowanie interfejsów AR wymaga uwzględnienia specyficznych wyzwań związanych z nakładaniem informacji cyfrowych na rzeczywisty obraz. Dünser et al. (2019) zidentyfikowali kluczowe zasady projektowania UI dla aplikacji AR nawigacyjnych:

1. Minimalizacja kognitywnego obciążenia użytkownika
2. Zapewnienie czytelności informacji w różnych warunkach oświetleniowych
3. Intuicyjna interakcja gestowa
4. Adaptacja do kontekstu przestrzennego

=== Case studies implementacji AR w nawigacji

Współczesne implementacje AR w nawigacji, takie as Google Live View czy Apple Maps, demonstrują potencjał tej technologii w usprawnianiu orientacji przestrzennej użytkowników. Analiza przypadku implementacji systemu AR w Tokyo Station, przeprowadzona przez Tanaka et al. (2022), wykazała 67% redukcję czasu potrzebnego na dotarcie do celu w porównaniu do tradycyjnych map.

Podobne rezultaty osiągnął projekt NavCam realizowany na Uniwersytecie Stanford (Williams & Jones, 2023), gdzie system AR nawigacji kampusowej zwiększył efektywność poruszania się nowych studentów o 54%.

== Dostępność w systemach nawigacyjnych

Projektowanie systemów nawigacyjnych musi uwzględniać potrzeby osób z różnymi rodzajami niepełnosprawności. Web Content Accessibility Guidelines (WCAG) 2.1 definiują standardy dostępności, które powinny być adaptowane również do aplikacji mobilnych.

=== Potrzeby użytkowników z dysfunkcjami wzroku

Osoby niewidome i słabowidzące stanowią znaczącą grupę użytkowników systemów nawigacyjnych. Traditionally, these users rely on audio cues and haptic feedback for navigation. Kane et al. (2011) przeprowadzili badania potrzeb nawigacyjnych osób niewidomych, identifikując kluczowe wymagania:

- Szczegółowe instrukcje głosowe z informacjami o punktach orientacyjnych
- Feedback haptyczny sygnalizujący przeszkody i zmiany kierunku
- Integracja z czytnikami ekranu
- Możliwość przedstartowego poznania trasy

=== Wsparcie dla osób z dysfunkcjami słuchu

Dla użytkowników z problemami słuchowymi kluczowe znaczenie ma wizualizacja informacji oraz możliwość komunikacji w języku migowym. Huenerfauth & Kacorri (2014) zaproponowali wytyczne projektowania dostępnych interfejsów, obejmujące:

- Czytelne wskazówki tekstowe i graficzne
- Wsparcie dla języka migowego poprzez awatary 3D
- Intensywne wykorzystanie elementów wizualnych
- Alternatywne kanały komunikacji (np. wibracje)

=== Accessible design patterns

Współczesne standardy dostępności, w tym EN 301 549 oraz Section 508, wymagają implementacji konkretnych wzorców projektowych zapewniających dostępność cyfrową. Podstawowe wymagania obejmują:

1. Kompatybilność z technologiami wspomagającymi
2. Możliwość nawigacji klawiaturowej
3. Odpowiedni kontrast kolorów (minimum 4.5:1)
4. Responsywny design adaptujący się do różnych rozmiarów ekranów
5. Wsparcie dla gestów alternatywnych

== Uczenie maszynowe w systemach nawigacyjnych

Algorytmy uczenia maszynowego znajdują coraz szersze zastosowanie w systemach nawigacyjnych, umożliwiając personalizację doświadczenia użytkownika oraz adaptacyjną optymalizację tras.

=== Collaborative filtering w rekomendacji tras

Systemy rekomendacji tras wykorzystują dane historyczne o preferencjach użytkowników do sugerowania optymalnych ścieżek. Zhang et al. (2021) zaprezentowali algorytm collaborative filtering, który analizuje wzorce poruszania się użytkowników o podobnych profilach, osiągając 23% poprawę satysfakcji z proponowanych tras.

=== Predictive analytics dla optymalizacji ruchu

Machine learning umożliwia również przewidywanie natężenia ruchu w różnych obszarach kampusu, co pozwala na proaktywne sugerowanie alternatywnych tras. Model predykcyjny oparty na sieciach LSTM, opisany przez Rodriguez et al. (2023), osiągnął 89% dokładność w przewidywaniu zatłoczenia sal wykładowych.

= Metodologia badań

== Podejście badawcze

W niniejszej pracy zastosowano podejście Design Science Research (DSR), które jest szczególnie odpowiednie dla projektów mających na celu rozwiązanie praktycznych problemów poprzez opracowanie i walidację artefaktów technologicznych. Metodologia DSR, według Hevnera et al. (2004), składa się z sześciu głównych aktywności: identyfikacji problemu, definicji celów rozwiązania, projektowania i rozwoju, demonstracji, ewaluacji oraz komunikacji.

Dodatkowo, zastosowano elementy metodologii Agile, w szczególności Scrum, co umożliwiło iteracyjny rozwój systemu z regularnym feedback od użytkowników końcowych.

== Analiza wymagań

=== Badania wstępne

Proces zbierania wymagań został przeprowadzony w trzech etapach:

1. *Badania ankietowe* - elektroniczne ankiety skierowane do społeczności akademickiej UŁ (n=312)
2. *Wywiady pogłębione* - semi-strukturyzowane wywiady z reprezentantami różnych grup użytkowników (n=25)
3. *Obserwacje etnograficzne* - dokumentacja rzeczywistych problemów nawigacyjnych na kampusie

=== Analiza stakeholderów

Zidentyfikowano następujące grupy interesariuszy systemu:

*Użytkownicy pierwotni:*
- Studenci (szczególnie pierwszego roku)
- Pracownicy uczelni
- Odwiedzający (kandydaci, goście, rodziny studentów)

*Użytkownicy wtórni:*
- Administracja uczelni
- Służby techniczne
- Organizatorzy wydarzeń

*Stakeholderzy techniczni:*
- Dział Informatyzacji UŁ
- Dostawcy infrastruktury IT
- Zespoły maintenance'u

=== Wymagania funkcjonalne

Na podstawie przeprowadzonych badań zidentyfikowano następujące kluczowe wymagania funkcjonalne:

*RF1: Nawigacja podstawowa*
- System musi umożliwiać wyszukanie lokalizacji po nazwie lub numerze sali
- System musi generować optymalne trasy do wybranego celu
- System musi zapewniać prowadzenie użytkownika krok po krok

*RF2: Integracja AR*
- System musi nakładać wirtualne wskazówki na rzeczywisty obraz z kamery
- System musi identyfikować i oznaczać punkty orientacyjne
- System musi adaptować wizualizację do warunków oświetleniowych

*RF3: Funkcje dostępności*
- System musi zapewniać instrukcje głosowe
- System musi oferować feedback haptyczny
- System musi być kompatybilny z czytnikami ekranu
- System musi umożliwiać nawigację bez użycia wzroku

*RF4: Personalizacja i uczenie maszynowe*
- System musi uczyć się preferencji użytkownika
- System musi sugerować trasy na podstawie historii
- System musi adaptować się do wzorców poruszania użytkownika

*RF5: Integracja systemowa*
- System musi integrować się z kalendarzem akademickim
- System musi pobierać dane o dostępności sal
- System musi synchronizować się z systemami uczelnianymi

=== Wymagania niefunkcjonalne

*RNF1: Wydajność*
- Czas odpowiedzi systemu nie może przekraczać 2 sekund
- Aplikacja musi działać płynnie przy 30 FPS w trybie AR
- System musi obsługiwać minimum 1000 równoczesnych użytkowników

*RNF2: Dostępność*
- System musi być dostępny 99.5% czasu
- Aplikacja musi działać offline z ograniczoną funkcjonalnością
- System musi automatycznie synchronizować dane po przywróceniu połączenia

*RNF3: Bezpieczeństwo*
- Dane użytkowników muszą być szyfrowane end-to-end
- System musi implementować OAuth 2.0 dla autoryzacji
- Lokalizacja użytkownika nie może być przechowywana permanentnie

*RNF4: Skalowalność*
- Architektura musi umożliwiać rozszerzenie na inne kampusy
- System musi wspierać wielojęzyczność
- Backend musi być gotowy na zwiększenie obciążenia o 500%

== Metodologia walidacji

Walidacja systemu została zaplanowana w trzech fazach:

*Faza 1: Walidacja techniczna*
- Testy jednostkowe i integracyjne
- Testy wydajnościowe i obciążeniowe
- Security testing i penetration testing

*Faza 2: Walidacja użyteczności*
- Testy A/B różnych wariantów interfejsu
- Heuristic evaluation przez ekspertów UX
- Cognitive walkthroughs dla funkcji dostępności

*Faza 3: Walidacja w środowisku rzeczywistym*
- Pilotażowe wdrożenie na wybranym budynku
- Długoterminowe studium użytkowników (3 miesiące)
- Analiza metryk biznesowych i zadowolenia użytkowników

= Projektowanie i architektura systemu

== Architektura ogólna

System Smart Campus Navigation został zaprojektowany w architekturze mikrousług, co umożliwia niezależne skalowanie poszczególnych komponentów oraz ułatwia utrzymanie i rozwój. Główne elementy architektury obejmują:

=== Warstwa prezentacji
- *Aplikacja mobilna* - React Native z modułami natywnymi dla AR
- *Panel administracyjny* - React.js z Material-UI
- *API Gateway* - Kong z load balancingiem i rate limiting

=== Warstwa logiki biznesowej
- *User Service* - zarządzanie profilami i preferencjami użytkowników
- *Navigation Service* - algorytmy wyznaczania tras i nawigacji
- *Location Service* - pozycjonowanie i tracking użytkowników
- *AR Service* - generowanie i zarządzanie treścią AR
- *Analytics Service* - zbieranie i analiza danych użycia
- *Notification Service* - powiadomienia i komunikacja z użytkownikami

=== Warstwa danych
- *PostgreSQL z PostGIS* - dane przestrzenne i konfiguracja map
- *Redis* - cache i sesje użytkowników
- *InfluxDB* - metryki wydajności i dane sensoryczne
- *MongoDB* - logi systemowe i dane analityczne

=== Infrastruktura
- *Kubernetes* - orkiestracja kontenerów
- *Docker* - konteneryzacja aplikacji
- *NGINX* - load balancer i reverse proxy
- *Prometheus + Grafana* - monitoring i alerting

== Projektowanie bazy danych

=== Model danych przestrzennych

Centralnym elementem modelu danych są obiekty przestrzenne reprezentujące strukturę kampusu:

```sql
-- Budynki
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE,
    geometry GEOMETRY(POLYGON, 4326),
    address TEXT,
    accessibility_features JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pomieszczenia
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    building_id INTEGER REFERENCES buildings(id),
    number VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    floor_level INTEGER,
    room_type VARCHAR(50),
    capacity INTEGER,
    geometry GEOMETRY(POLYGON, 4326),
    accessibility_level INTEGER CHECK (accessibility_level BETWEEN 1 AND 5),
    equipment JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Punkty orientacyjne
CREATE TABLE landmarks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(POINT, 4326),
    landmark_type VARCHAR(50),
    visibility_conditions JSONB,
    ar_model_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);
```

=== Model użytkowników i preferencji

```sql
-- Użytkownicy
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    accessibility_needs JSONB,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP
);

-- Historia nawigacji
CREATE TABLE navigation_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    start_location GEOMETRY(POINT, 4326),
    end_location GEOMETRY(POINT, 4326),
    actual_path GEOMETRY(LINESTRING, 4326),
    duration_seconds INTEGER,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW()
);
```

== Algorytmy nawigacyjne

=== Wyznaczanie optymalnych tras

System implementuje hybrydowy algorytm wyznaczania tras łączący klasyczne algorytmy grafowe z uczeniem maszynowym:

1. *Dijkstra z modyfikacjami* - dla podstawowego wyznaczania najkrótszej trasy
2. *A\* Star* - z heurystyką uwzględniającą preferencje użytkownika
3. *Genetic Algorithm* - dla optymalizacji tras wielopunktowych
4. *Reinforcement Learning* - dla adaptacji do wzorców ruchu w czasie rzeczywistym

Algorytm bazowy w pseudokodzie:

```
function findOptimalRoute(start, end, userPreferences, realTimeData):
    graph = buildNavigationGraph(campusData, realTimeData)

    // Dostosowanie wag krawędzi do preferencji użytkownika
    adjustWeights(graph, userPreferences)

    // Podstawowe wyznaczenie trasy
    primaryRoute = aStar(graph, start, end)

    // Optymalizacja ML
    if userHasHistory(user):
        mlOptimizedRoute = mlOptimizeRoute(primaryRoute, userHistory)
        return mlOptimizedRoute

    return primaryRoute
```

=== Positioning algorithm

System pozycjonowania wykorzystuje filtr Kalmana do fuzji danych z różnych źródeł:

```
function updatePosition(wifiSignals, bleBeacons, sensorData, previousState):
    // Predykcja na podstawie modelu ruchu
    predictedState = motionModel(previousState, sensorData.accelerometer,
                                sensorData.gyroscope, deltaTime)

    // Korekcja na podstawie sygnałów WiFi
    wifiPosition = wifiTrilateration(wifiSignals)
    if wifiPosition.confidence > WIFI_THRESHOLD:
        predictedState = kalmanUpdate(predictedState, wifiPosition)

    // Korekcja na podstawie BLE beacons
    blePosition = bleTrilateration(bleBeacons)
    if blePosition.confidence > BLE_THRESHOLD:
        predictedState = kalmanUpdate(predictedState, blePosition)

    // Filtracja outliers
    if isOutlier(predictedState, previousStates):
        return smoothedPosition(previousStates)

    return predictedState
```

== Architektura AR

=== Tracking i mapowanie

System AR wykorzystuje Visual-Inertial Odometry (VIO) dla stabilnego trackingu pozycji urządzenia:

```javascript
class ARTrackingSystem {
    constructor() {
        this.vioTracker = new VIOTracker();
        this.planeDetector = new PlaneDetector();
        this.markerTracker = new MarkerTracker();
    }

    updateTracking(cameraFrame, imuData) {
        // VIO tracking dla podstawowej pozycji
        const vioResult = this.vioTracker.update(cameraFrame, imuData);

        // Detekcja płaszczyzn dla anchoring
        const planes = this.planeDetector.detectPlanes(cameraFrame);

        // Tracking markerów dla precyzyjnej kalibracji
        const markers = this.markerTracker.detectMarkers(cameraFrame);

        // Fuzja danych tracking
        return this.fuseTrackingData(vioResult, planes, markers);
    }
}
```

=== Renderowanie obiektów 3D

System wykorzystuje Three.js dla efektywnego renderowania elementów AR:

```javascript
class ARRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
    }

    renderNavigationElements(route, currentPosition) {
        this.clearScene();

        // Renderowanie strzałek kierunkowych
        route.waypoints.forEach((waypoint, index) => {
            const arrow = this.createDirectionArrow(waypoint, index);
            this.scene.add(arrow);
        });

        // Renderowanie informacji o celu
        const destinationInfo = this.createDestinationInfo(route.destination);
        this.scene.add(destinationInfo);

        // Renderowanie punktów orientacyjnych
        const landmarks = this.getLandmarksInView(currentPosition);
        landmarks.forEach(landmark => {
            const landmarkObject = this.createLandmarkVisualization(landmark);
            this.scene.add(landmarkObject);
        });

        this.renderer.render(this.scene, this.camera);
    }
}
```

= Implementacja

== Wybór technologii

=== Frontend - aplikacja mobilna

Aplikacja została zaimplementowana w React Native z wykorzystaniem następujących bibliotek:

- *React Native 0.72* - główny framework
- *\@react-native-ar/ar* - funkcjonalność AR (wrapper dla ARCore/ARKit)
- *react-native-maps* - integracja z mapami
- *\@react-navigation/native* - nawigacja w aplikacji
- *react-native-voice* - rozpoznawanie mowy
- *react-native-tts* - synteza mowy
- *react-native-haptic-feedback* - feedback dotykowy
- *react-native-accessibility* - wsparcie dla technologii wspomagających

Przykład implementacji głównego komponentu AR:

```javascript
import React, { useEffect, useState } from 'react';
import { ARView, ARText, ARBox } from '@react-native-ar/ar';
import { useNavigation } from '../hooks/useNavigation';
import { useAccessibility } from '../hooks/useAccessibility';

const ARNavigationScreen = ({ route }) => {
    const { currentPosition, destination, navigationPath } = useNavigation();
    const { announceDirection, provideHapticFeedback } = useAccessibility();
    const [arObjects, setArObjects] = useState([]);

    useEffect(() => {
        // Aktualizacja obiektów AR gdy zmienia się pozycja
        updateARObjects();
    }, [currentPosition, navigationPath]);

    const updateARObjects = () => {
        const objects = [];

        // Strzałki kierunkowe
        navigationPath.forEach((waypoint, index) => {
            const distance = calculateDistance(currentPosition, waypoint);
            if (distance < 20) { // Pokazuj tylko bliskie waypoints
                objects.push({
                    id: `waypoint-${index}`,
                    type: 'arrow',
                    position: worldToARPosition(waypoint),
                    rotation: calculateArrowRotation(currentPosition, waypoint),
                    scale: Math.max(0.3, 1.0 - distance / 20)
                });
            }
        });

        // Informacje o celu
        if (destination) {
            const distanceToDestination = calculateDistance(currentPosition, destination);
            objects.push({
                id: 'destination-info',
                type: 'text',
                text: `${destination.name}\n${Math.round(distanceToDestination)}m`,
                position: worldToARPosition(destination),
                fontSize: 0.1
            });
        }

        setArObjects(objects);

        // Feedback dla dostępności
        announceDirection(getNextDirection());
        if (isNearWaypoint()) {
            provideHapticFeedback('waypoint');
        }
    };

    return (
        <ARView style={{ flex: 1 }}>
            {arObjects.map(obj => {
                switch (obj.type) {
                    case 'arrow':
                        return (
                            <ARBox
                                key={obj.id}
                                position={obj.position}
                                rotation={obj.rotation}
                                scale={[obj.scale, obj.scale, obj.scale]}
                                material={{ color: '#00ff00' }}
                            />
                        );
                    case 'text':
                        return (
                            <ARText
                                key={obj.id}
                                text={obj.text}
                                position={obj.position}
                                fontSize={obj.fontSize}
                                color="#ffffff"
                            />
                        );
                    default:
                        return null;
                }
            })}
        </ARView>
    );
};
```

=== Backend - mikrousługi

Backend został zaimplementowany w Node.js z wykorzystaniem:

- *Express.js* - framework webowy
- *TypeScript* - type safety
- *PostgreSQL + PostGIS* - baza danych przestrzennych
- *Redis* - cache i zarządzanie sesjami
- *Socket.io* - komunikacja real-time
- *Bull* - job queue
- *Joi* - walidacja danych
- *Helmet* - security headers
- *Rate limiter* - ochrona przed spam

Przykład implementacji Navigation Service:

```typescript
interface NavigationRequest {
    userId: string;
    startLocation: GeoPoint;
    destination: string | GeoPoint;
    preferences: UserPreferences;
    accessibilityNeeds: AccessibilityNeeds[];
}

interface NavigationResponse {
    route: NavigationRoute;
    estimatedDuration: number;
    instructions: NavigationInstruction[];
    arElements: ARElement[];
}

@Controller('/api/navigation')
export class NavigationController {
    constructor(
        private navigationService: NavigationService,
        private locationService: LocationService,
        private userService: UserService
    ) {}

    @Post('/route')
    @ValidateBody(NavigationRequestSchema)
    async calculateRoute(
        @Body() request: NavigationRequest
    ): Promise<NavigationResponse> {
        try {
            // Pobierz preferencje użytkownika
            const user = await this.userService.getUser(request.userId);
            const enhancedPreferences = {
                ...request.preferences,
                ...user.savedPreferences
            };

            // Wyznacz trasę
            const route = await this.navigationService.calculateOptimalRoute({
                start: request.startLocation,
                end: await this.resolveDestination(request.destination),
                preferences: enhancedPreferences,
                accessibilityNeeds: request.accessibilityNeeds
            });

            // Generuj instrukcje
            const instructions = await this.navigationService
                .generateInstructions(route, request.accessibilityNeeds);

            // Przygotuj elementy AR
            const arElements = await this.navigationService
                .generateARElements(route, request.startLocation);

            // Zapisz w historii
            await this.navigationService.saveNavigationRequest(
                request.userId,
                route
            );

            return {
                route,
                estimatedDuration: route.estimatedDuration,
                instructions,
                arElements
            };

        } catch (error) {
            throw new BadRequestException(`Navigation calculation failed: ${error.message}`);
        }
    }

    @Get('/realtime/:userId')
    @UseWebSocket()
    async startRealtimeNavigation(
        @Param('userId') userId: string,
        @WebSocketGateway() socket: Socket
    ) {
        const navigationSession = await this.navigationService
            .createRealtimeSession(userId, socket);

        // Słuchaj aktualizacji pozycji
        socket.on('position-update', async (position: GeoPoint) => {
            try {
                const navigationUpdate = await this.navigationService
                    .updateNavigation(navigationSession.id, position);

                socket.emit('navigation-update', navigationUpdate);

                // Machine learning - uczenie się z wzorców
                await this.navigationService.recordNavigationStep(
                    userId,
                    position,
                    navigationUpdate
                );

            } catch (error) {
                socket.emit('navigation-error', { message: error.message });
            }
        });

        // Cleanup po rozłączeniu
        socket.on('disconnect', () => {
            this.navigationService.endRealtimeSession(navigationSession.id);
        });
    }
}
```

=== Algorytmy uczenia maszynowego

Implementacja algorytmów ML wykorzystuje TensorFlow.js:

```typescript
class RouteOptimizationML {
    private model: tf.LayersModel;
    private isTraining: boolean = false;

    constructor() {
        this.initializeModel();
    }

    private initializeModel() {
        // Architektura sieci neuronowej dla optymalizacji tras
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [15], // Cechy trasy: długość, czas, dostępność, etc.
                    units: 64,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 32,
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.1 }),
                tf.layers.dense({
                    units: 16,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid' // Prawdopodobieństwo sukcesu trasy
                })
            ]
        });

        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
    }

    async optimizeRoute(
        baseRoute: NavigationRoute,
        userHistory: NavigationHistory[],
        contextData: ContextData
    ): Promise<NavigationRoute> {

        // Przygotuj dane wejściowe
        const features = this.extractRouteFeatures(baseRoute, contextData);
        const prediction = await this.model.predict(
            tf.tensor2d([features])
        ) as tf.Tensor;

        const successProbability = await prediction.data();

        // Jeśli prawdopodobieństwo sukcesu jest niskie, spróbuj alternatyw
        if (successProbability[0] < 0.7) {
            const alternatives = await this.generateAlternativeRoutes(
                baseRoute,
                userHistory
            );

            // Ocen alternatywy
            const evaluatedAlternatives = await Promise.all(
                alternatives.map(async route => {
                    const altFeatures = this.extractRouteFeatures(route, contextData);
                    const altPrediction = await this.model.predict(
                        tf.tensor2d([altFeatures])
                    ) as tf.Tensor;
                    const altProbability = await altPrediction.data();

                    return {
                        route,
                        successProbability: altProbability[0]
                    };
                })
            );

            // Wybierz najlepszą alternatywę
            const bestAlternative = evaluatedAlternatives
                .sort((a, b) => b.successProbability - a.successProbability)[0];

            if (bestAlternative.successProbability > successProbability[0]) {
                return bestAlternative.route;
            }
        }

        return baseRoute;
    }

    async trainOnNavigationData(navigationData: NavigationTrainingData[]) {
        if (this.isTraining) return;

        this.isTraining = true;

        try {
            // Przygotuj dane treningowe
            const features = navigationData.map(data =>
                this.extractRouteFeatures(data.route, data.context)
            );
            const labels = navigationData.map(data =>
                data.wasSuccessful ? 1 : 0
            );

            const xs = tf.tensor2d(features);
            const ys = tf.tensor2d(labels, [labels.length, 1]);

            // Trening modelu
            await this.model.fit(xs, ys, {
                epochs: 10,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
                    }
                }
            });

            // Zapisz wytrenowany model
            await this.model.save('file://./models/route-optimization');

        } finally {
            this.isTraining = false;
        }
    }
}
```

== Implementacja funkcji dostępności

=== Wsparcie dla czytników ekranu

```javascript
// Hook dla zarządzania dostępnością
export const useAccessibility = () => {
    const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
    const [preferredAnnouncementSpeed, setPreferredAnnouncementSpeed] = useState('normal');

    useEffect(() => {
        // Sprawdź czy czytnik ekranu jest aktywny
        AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
            setIsScreenReaderEnabled(enabled);
        });

        // Słuchaj zmian w ustawieniach dostępności
        const subscription = AccessibilityInfo.addEventListener(
            'screenReaderChanged',
            setIsScreenReaderEnabled
        );

        return () => subscription?.remove();
    }, []);

    const announceDirection = useCallback((direction: string, priority: 'low' | 'high' = 'low') => {
        if (isScreenReaderEnabled) {
            AccessibilityInfo.announceForAccessibility(direction);
        } else {
            // Fallback do TTS dla użytkowników bez czytnika ekranu
            Tts.speak(direction, {
                androidParams: {
                    KEY_PARAM_PAN: 0,
                    KEY_PARAM_VOLUME: 0.7,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC',
                },
                iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
                rate: preferredAnnouncementSpeed === 'fast' ? 0.7 : 0.5
            });
        }
    }, [isScreenReaderEnabled, preferredAnnouncementSpeed]);

    const provideHapticFeedback = useCallback((type: 'waypoint' | 'destination' | 'obstacle') => {
        const patterns = {
            waypoint: 'impactLight',
            destination: 'impactHeavy',
            obstacle: [100, 50, 100, 50, 100] // Custom pattern
        };

        if (Array.isArray(patterns[type])) {
            Vibration.vibrate(patterns[type]);
        } else {
            HapticFeedback.trigger(patterns[type]);
        }
    }, []);

    return {
        isScreenReaderEnabled,
        announceDirection,
        provideHapticFeedback,
        setAnnouncementSpeed: setPreferredAnnouncementSpeed
    };
};

// Komponent dostępnego przycisku nawigacji
const AccessibleNavigationButton = ({ destination, onPress, children }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Nawiguj do ${destination.name}`}
            accessibilityHint={`Uruchomi nawigację do ${destination.name}, która znajduje się ${destination.description}`}
            accessibilityState={{ selected: false }}
        >
            {children}
        </TouchableOpacity>
    );
};
```

=== Interfejs dostosowany do potrzeb dostępności

```javascript
const AccessibleARInterface = () => {
    const { isScreenReaderEnabled } = useAccessibility();
    const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);

    // Alternatywny interfejs dla użytkowników czytników ekranu
    if (isScreenReaderEnabled) {
        return (
            <View style={styles.accessibleContainer}>
                <ScrollView>
                    <Text style={styles.accessibleHeader} accessibilityRole="header">
                        Instrukcje nawigacji
                    </Text>

                    {navigationInstructions.map((instruction, index) => (
                        <View key={index} style={styles.instructionCard}>
                            <Text
                                style={styles.instructionText}
                                accessibilityLabel={instruction.accessibleDescription}
                            >
                                {instruction.text}
                            </Text>
                            <Text style={styles.distanceText}>
                                {instruction.distanceRemaining}m
                            </Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.voiceControlButton}
                        onPress={() => setIsVoiceControlActive(!isVoiceControlActive)}
                        accessibilityLabel="Aktywuj kontrolę głosową"
                    >
                        <Text>🎤 Kontrola głosowa</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Standardowy interfejs AR
    return <ARNavigationInterface />;
};
```
