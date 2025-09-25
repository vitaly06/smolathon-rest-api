--
-- PostgreSQL database dump
--

\restrict LeRReGudfqECZxFH83bRQ9byuFLFOkM0CdDPK2HJ5Lxi1IN2BMGHHyKjv7hczVz

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AccidentStatistic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AccidentStatistic" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "incidentsCount" integer NOT NULL,
    "injuredCount" integer NOT NULL,
    "fatalitiesCount" integer NOT NULL,
    location text,
    period text NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."AccidentStatistic" OWNER TO postgres;

--
-- Name: AccidentStatistic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AccidentStatistic_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AccidentStatistic_id_seq" OWNER TO postgres;

--
-- Name: AccidentStatistic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AccidentStatistic_id_seq" OWNED BY public."AccidentStatistic".id;


--
-- Name: Document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Document" (
    id integer NOT NULL,
    title text NOT NULL,
    "fileUrl" text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."Document" OWNER TO postgres;

--
-- Name: Document_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Document_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Document_id_seq" OWNER TO postgres;

--
-- Name: Document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Document_id_seq" OWNED BY public."Document".id;


--
-- Name: EvacuationStatistic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EvacuationStatistic" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "evacuatorsCount" integer NOT NULL,
    "tripsCount" integer NOT NULL,
    "evacuationsCount" integer NOT NULL,
    "parkingLotRevenues" double precision NOT NULL,
    period text NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."EvacuationStatistic" OWNER TO postgres;

--
-- Name: EvacuationStatistic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EvacuationStatistic_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EvacuationStatistic_id_seq" OWNER TO postgres;

--
-- Name: EvacuationStatistic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EvacuationStatistic_id_seq" OWNED BY public."EvacuationStatistic".id;


--
-- Name: EvacuatorRoute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EvacuatorRoute" (
    id integer NOT NULL,
    "routeName" text NOT NULL,
    description text NOT NULL,
    waypoints text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."EvacuatorRoute" OWNER TO postgres;

--
-- Name: EvacuatorRoute_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EvacuatorRoute_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EvacuatorRoute_id_seq" OWNER TO postgres;

--
-- Name: EvacuatorRoute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EvacuatorRoute_id_seq" OWNED BY public."EvacuatorRoute".id;


--
-- Name: FineStatistic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FineStatistic" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "violationsCount" integer NOT NULL,
    "decreesCount" integer NOT NULL,
    "imposedFines" double precision NOT NULL,
    "collectedFines" double precision NOT NULL,
    period text NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."FineStatistic" OWNER TO postgres;

--
-- Name: FineStatistic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FineStatistic_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FineStatistic_id_seq" OWNER TO postgres;

--
-- Name: FineStatistic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FineStatistic_id_seq" OWNED BY public."FineStatistic".id;


--
-- Name: News; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."News" (
    id integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."News" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."News_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."News_id_seq" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."News_id_seq" OWNED BY public."News".id;


--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Project_id_seq" OWNER TO postgres;

--
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    cost double precision NOT NULL,
    "orderFormDetails" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: Service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Service_id_seq" OWNER TO postgres;

--
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Service_id_seq" OWNED BY public."Service".id;


--
-- Name: Statistics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Statistics" (
    id integer NOT NULL,
    subject text NOT NULL,
    "pointFpsr" text NOT NULL,
    "indicatorName" text NOT NULL,
    "indicatorValue" double precision,
    "indicatorValueString" text,
    period text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Statistics" OWNER TO postgres;

--
-- Name: Statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Statistics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Statistics_id_seq" OWNER TO postgres;

--
-- Name: Statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Statistics_id_seq" OWNED BY public."Statistics".id;


--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamMember" (
    id integer NOT NULL,
    name text NOT NULL,
    "position" text NOT NULL,
    bio text NOT NULL,
    "photoUrl" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."TeamMember" OWNER TO postgres;

--
-- Name: TeamMember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TeamMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamMember_id_seq" OWNER TO postgres;

--
-- Name: TeamMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TeamMember_id_seq" OWNED BY public."TeamMember".id;


--
-- Name: TrafficLight; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrafficLight" (
    id integer NOT NULL,
    address text NOT NULL,
    type text NOT NULL,
    "installationDate" timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer
);


ALTER TABLE public."TrafficLight" OWNER TO postgres;

--
-- Name: TrafficLight_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TrafficLight_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TrafficLight_id_seq" OWNER TO postgres;

--
-- Name: TrafficLight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TrafficLight_id_seq" OWNED BY public."TrafficLight".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    login text NOT NULL,
    password text NOT NULL,
    "roleId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "refreshToken" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Vacancy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vacancy" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "userId" integer,
    address text NOT NULL,
    experience text,
    salary integer NOT NULL
);


ALTER TABLE public."Vacancy" OWNER TO postgres;

--
-- Name: Vacancy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vacancy_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vacancy_id_seq" OWNER TO postgres;

--
-- Name: Vacancy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vacancy_id_seq" OWNED BY public."Vacancy".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: AccidentStatistic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccidentStatistic" ALTER COLUMN id SET DEFAULT nextval('public."AccidentStatistic_id_seq"'::regclass);


--
-- Name: Document id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document" ALTER COLUMN id SET DEFAULT nextval('public."Document_id_seq"'::regclass);


--
-- Name: EvacuationStatistic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvacuationStatistic" ALTER COLUMN id SET DEFAULT nextval('public."EvacuationStatistic_id_seq"'::regclass);


--
-- Name: EvacuatorRoute id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvacuatorRoute" ALTER COLUMN id SET DEFAULT nextval('public."EvacuatorRoute_id_seq"'::regclass);


--
-- Name: FineStatistic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FineStatistic" ALTER COLUMN id SET DEFAULT nextval('public."FineStatistic_id_seq"'::regclass);


--
-- Name: News id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News" ALTER COLUMN id SET DEFAULT nextval('public."News_id_seq"'::regclass);


--
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: Service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service" ALTER COLUMN id SET DEFAULT nextval('public."Service_id_seq"'::regclass);


--
-- Name: Statistics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Statistics" ALTER COLUMN id SET DEFAULT nextval('public."Statistics_id_seq"'::regclass);


--
-- Name: TeamMember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember" ALTER COLUMN id SET DEFAULT nextval('public."TeamMember_id_seq"'::regclass);


--
-- Name: TrafficLight id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrafficLight" ALTER COLUMN id SET DEFAULT nextval('public."TrafficLight_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Vacancy id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacancy" ALTER COLUMN id SET DEFAULT nextval('public."Vacancy_id_seq"'::regclass);


--
-- Data for Name: AccidentStatistic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AccidentStatistic" (id, date, "incidentsCount", "injuredCount", "fatalitiesCount", location, period, "isPublic", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Document" (id, title, "fileUrl", description, "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: EvacuationStatistic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EvacuationStatistic" (id, date, "evacuatorsCount", "tripsCount", "evacuationsCount", "parkingLotRevenues", period, "isPublic", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: EvacuatorRoute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EvacuatorRoute" (id, "routeName", description, waypoints, "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: FineStatistic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FineStatistic" (id, date, "violationsCount", "decreesCount", "imposedFines", "collectedFines", period, "isPublic", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."News" (id, title, body, "imageUrl", "createdAt", "userId") FROM stdin;
1	Ограничение массы	В связи с введением Администрацией муниципального образования «Смоленский муниципальный округ» Смоленской области запрета на движение грузовых транспортных средств с полной массой свыше 3,5 т по мостовому сооружению через р. Каспля, расположенному между населенными пунктами с. Каспля-1 и с. Каспля-2, сообщаем следующее. СОГБУ «ЦОДД» совместно с Управлением Госавтоинспекции УМВД России по Смоленской области, с целью обеспечения безопасного и беспрепятственного проезда транспорта по данному мостовому сооружению, принято решение о размещении стационарного комплекса автоматической фиксации нарушений правил дорожного движения, включая превышение установленной скорости движения, а также требований, предписанных дорожными знаками, запрещающими движение грузовых транспортных средств. Обращаем внимание, что согласно ч.6 ст.12.16 КоАП РФ штраф за несоблюдение требований указанных дорожных знаков составляет 5000 руб.	1758784028135-903319220.jpg	2025-09-25 07:07:08.171	\N
2	ФКУ «Упрдор Москва – Бобруйск»	В связи с введением ФКУ «Упрдор Москва – Бобруйск» запрета на движение грузовых транспортных средств с полной массой свыше 3,5 т в связи с неудовлетворительным состоянием моста через р. Днепр сообщаем следующее. СОГБУ «ЦОДД» совместно с Госавтоинспекцией, с целью обеспечения безопасного и беспрепятственного проезда транспорта по дороге общего пользования федерального значения Р-120 «Орёл – Брянск – Смоленск – граница с Республикой Беларусь» юго-западный обход г. Смоленска, принято решение о фиксации с 16.05.2025 нарушения требований, предписанных дорожными знаками, запрещающими движение грузовых транспортных средств комплексом, установленным на км 19+670 вышеуказанной автомобильной дороги. Согласно ч.6 ст.12.16 Кодекс Российской Федерации об административных правонарушениях штраф, за несоблюдение требований указанных дорожных знаков составляет 5000 руб.	1758784074445-746137146.jpg	2025-09-25 07:07:54.504	\N
3	В Смоленске отключат светофоры	На время проведения ремонтных работ на электросетях, будет отключен светофорный объект: 05 и 06 мая с 9:00 до 17:00 Колхозная пл.	1758784130385-983603077.jpg	2025-09-25 07:08:50.394	\N
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, title, description, status, "startDate", "endDate", "imageUrl", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name) FROM stdin;
1	editor
2	admin
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, description, cost, "orderFormDetails", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: Statistics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Statistics" (id, subject, "pointFpsr", "indicatorName", "indicatorValue", "indicatorValueString", period, "createdAt") FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamMember" (id, name, "position", bio, "photoUrl", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: TrafficLight; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TrafficLight" (id, address, type, "installationDate", status, latitude, longitude, "isPublic", "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, login, password, "roleId", "createdAt", "updatedAt", "refreshToken") FROM stdin;
1	admin	$2b$10$a7aUXiPb1S/dEt6Wz5BpWe8DR/3nPy7COwsqKOjoW78oh3W0c/DzO	2	2025-09-25 05:15:37.772	2025-09-25 05:15:37.772	\N
\.


--
-- Data for Name: Vacancy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vacancy" (id, title, description, "userId", address, experience, salary) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Name: AccidentStatistic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AccidentStatistic_id_seq"', 1, false);


--
-- Name: Document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Document_id_seq"', 1, false);


--
-- Name: EvacuationStatistic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EvacuationStatistic_id_seq"', 1, false);


--
-- Name: EvacuatorRoute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EvacuatorRoute_id_seq"', 1, false);


--
-- Name: FineStatistic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FineStatistic_id_seq"', 1, false);


--
-- Name: News_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."News_id_seq"', 3, true);


--
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Project_id_seq"', 1, false);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 2, true);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Service_id_seq"', 1, false);


--
-- Name: Statistics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Statistics_id_seq"', 1, false);


--
-- Name: TeamMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TeamMember_id_seq"', 1, false);


--
-- Name: TrafficLight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TrafficLight_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Vacancy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vacancy_id_seq"', 1, false);


--
-- Name: AccidentStatistic AccidentStatistic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccidentStatistic"
    ADD CONSTRAINT "AccidentStatistic_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: EvacuationStatistic EvacuationStatistic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvacuationStatistic"
    ADD CONSTRAINT "EvacuationStatistic_pkey" PRIMARY KEY (id);


--
-- Name: EvacuatorRoute EvacuatorRoute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvacuatorRoute"
    ADD CONSTRAINT "EvacuatorRoute_pkey" PRIMARY KEY (id);


--
-- Name: FineStatistic FineStatistic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FineStatistic"
    ADD CONSTRAINT "FineStatistic_pkey" PRIMARY KEY (id);


--
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: Statistics Statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Statistics"
    ADD CONSTRAINT "Statistics_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: TrafficLight TrafficLight_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrafficLight"
    ADD CONSTRAINT "TrafficLight_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Vacancy Vacancy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacancy"
    ADD CONSTRAINT "Vacancy_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: User_login_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_login_key" ON public."User" USING btree (login);


--
-- Name: AccidentStatistic AccidentStatistic_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccidentStatistic"
    ADD CONSTRAINT "AccidentStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Document Document_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EvacuationStatistic EvacuationStatistic_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvacuationStatistic"
    ADD CONSTRAINT "EvacuationStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EvacuatorRoute EvacuatorRoute_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EvacuatorRoute"
    ADD CONSTRAINT "EvacuatorRoute_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FineStatistic FineStatistic_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FineStatistic"
    ADD CONSTRAINT "FineStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: News News_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Project Project_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamMember TeamMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TrafficLight TrafficLight_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrafficLight"
    ADD CONSTRAINT "TrafficLight_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Vacancy Vacancy_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacancy"
    ADD CONSTRAINT "Vacancy_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict LeRReGudfqECZxFH83bRQ9byuFLFOkM0CdDPK2HJ5Lxi1IN2BMGHHyKjv7hczVz

