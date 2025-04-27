import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button, Badge, Form } from "react-bootstrap";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameDay,
    isSameMonth,
    parseISO,
    isToday
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMarkedItems } from "../hooks/useCalendar";

const CalendarioInterativo = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [animeData, setAnimeData] = useState([]);
    const [filter, setFilter] = useState("all");
    const [hoveredDay, setHoveredDay] = useState(null);
    const { markedItems, markItem } = useMarkedItems();

    const colors = {
        background: "hsl(240, 15%, 12%)",
        cardBackground: "hsl(240, 15%, 18%)",
        text: "hsl(0, 0%, 90%)",
        textMuted: "hsl(0, 0%, 60%)",
        primary: "hsl(210, 100%, 60%)",
        secondary: "hsl(270, 50%, 60%)",
        accent: "hsl(45, 100%, 60%)",
        today: "hsl(120, 60%, 50%)",
        border: "hsl(240, 15%, 25%)",
        modalHeader: "linear-gradient(135deg, hsl(240, 30%, 25%), hsl(240, 30%, 35%))"
    };

    useEffect(() => {
        const loadData = () => {
            const seasonAnimes = JSON.parse(localStorage.getItem("seasonAnimes")) || [];
            const newsAnimes = JSON.parse(localStorage.getItem("news")) || [];
            const mangas = JSON.parse(localStorage.getItem("mangas")) || [];
            const animes = [...seasonAnimes, ...newsAnimes].reduce((acc, current) => {
                if (!acc.some(item => item.mal_id === current.mal_id)) {
                    acc.push(current);
                }
                return acc;
            }, []);

            console.log("Animes:", animes);
            console.log("Mangas:", mangas);

            const combined = [...animes, ...mangas].map(item => {
                const dateStr = item.aired?.from || item.published?.from || null;
                if (!dateStr) return null;

                const dateOnly = dateStr.split('T')[0];
                const formattedDate = dateOnly.replace(/\//g, '-');

                return {
                    ...item,
                    date: formattedDate,
                    type: item.aired ? "anime" : "manga"
                };
            }).filter(Boolean);

            setAnimeData(combined);
        };

        loadData();
        window.addEventListener("storage", loadData);
        return () => window.removeEventListener("storage", loadData);
    }, []);

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const filteredAnimeData = animeData.filter(item => {
        if (filter === "all") return true;
        return item.type === filter;
    });

    const renderHeader = () => (
        <motion.div
            className="d-flex justify-content-between align-items-center mb-3 px-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Button
                variant="link"
                className="text-white p-0"
                onClick={prevMonth}
                style={{ fontSize: "1.2rem" }}
            >
                ‹
            </Button>

            <motion.h4
                className="m-0 text-center fw-bold"
                key={format(currentMonth, "MMyyyy")}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ color: colors.text, fontSize: "1rem" }}
            >
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </motion.h4>

            <Button
                variant="link"
                className="text-white p-0"
                onClick={nextMonth}
                style={{ fontSize: "1.2rem" }}
            >
                ›
            </Button>
        </motion.div>
    );

    const renderDayNames = () => {
        const dayNames = [];
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            dayNames.push(
                <motion.div
                    key={i}
                    className="text-center text-uppercase small mb-1"
                    style={{ color: colors.textMuted, fontSize: "0.7rem" }}
                >
                    {format(day, "EEE", { locale: ptBR })}
                </motion.div>
            );
        }

        return (
            <div className="d-grid mb-1" style={{
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.3rem"
            }}>
                {dayNames}
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(startOfMonth(currentMonth));
        const endDate = endOfWeek(endOfMonth(currentMonth));
        let day = startDate;

        while (day <= endDate) {
            const dayCopy = new Date(day);
            const formattedDate = format(day, "yyyy-MM-dd");
            const dayAnimes = filteredAnimeData.filter(a =>
                format(parseISO(a.date), "yyyy-MM-dd") === formattedDate
            );

            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isActiveDay = isCurrentMonth && dayAnimes.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            days.push(
                <motion.div
                    key={formattedDate}
                    onClick={() => {
                        if (isCurrentMonth) {
                            setSelectedDate(new Date(dayCopy));
                            console.log("Data selecionada:", day);
                            if (dayAnimes.length > 0) setShowModal(true);
                        }
                    }}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`position-relative rounded-2 p-1 ${isCurrentMonth ? "cursor-pointer" : ""}`}
                    style={{
                        aspectRatio: "1",
                        background: isSelected
                            ? `hsla(210, 100%, 60%, 0.2)`
                            : isTodayDate && isCurrentMonth
                                ? `hsla(120, 60%, 50%, 0.15)`
                                : isCurrentMonth
                                    ? colors.cardBackground
                                    : `hsla(240, 15%, 18%, 0.3)`,
                        border: isTodayDate && isCurrentMonth
                            ? `1px solid ${colors.today}`
                            : `1px solid ${colors.border}`,
                        opacity: isCurrentMonth ? 1 : 0.5,
                        transition: "all 0.2s ease",
                        fontSize: "0.8rem"
                    }}
                    whileHover={isCurrentMonth ? {
                        scale: 1.05,
                        backgroundColor: `hsla(240, 15%, 25%, 0.5)`
                    } : {}}
                    animate={{
                        scale: isSelected ? 1.05 : 1
                    }}
                >
                    <div className="d-flex flex-column h-100">
                        <span
                            className={`text-end ${isTodayDate && isCurrentMonth ? "fw-bold" : ""}`}
                            style={{
                                color: isTodayDate && isCurrentMonth
                                    ? colors.today
                                    : colors.text
                            }}
                        >
                            {format(day, "d")}
                        </span>

                        {isActiveDay && (
                            <motion.div
                                className="mt-auto mx-auto"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Badge
                                    bg={dayAnimes.some(a => a.type === "anime") ? "primary" : "warning"}
                                    className="rounded-pill"
                                    style={{
                                        fontSize: "0.55rem",
                                        padding: "0.2rem 0.4rem"
                                    }}
                                >
                                    {dayAnimes.length}
                                </Badge>
                            </motion.div>
                        )}
                    </div>

                    {/* Preview no hover */}
                    {hoveredDay && isSameDay(hoveredDay, day) && dayAnimes.length > 0 && (
                        <motion.div
                            className="position-absolute bottom-100 start-50 translate-middle-x mb-1 z-3"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                        >
                            <div
                                className="rounded-2 shadow p-2"
                                style={{
                                    width: "160px",
                                    background: colors.cardBackground,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <div
                                    className="text-center small fw-bold mb-1"
                                    style={{ color: colors.text }}
                                >
                                    {dayAnimes.length} lançamento{dayAnimes.length > 1 ? "s" : ""}
                                </div>
                                <div className="d-flex flex-wrap gap-1 justify-content-center">
                                    {dayAnimes.slice(0, 3).map(item => (
                                        <Badge
                                            key={item.mal_id}
                                            bg={item.type === "anime" ? "primary" : "warning"}
                                            className="text-truncate"
                                            style={{
                                                maxWidth: "100%",
                                                fontSize: "0.6rem",
                                                padding: "0.2rem 0.3rem"
                                            }}
                                        >
                                            {item.title_short || item.title}
                                        </Badge>
                                    ))}
                                    {dayAnimes.length > 3 && (
                                        <Badge
                                            bg="secondary"
                                            style={{
                                                fontSize: "0.6rem",
                                                padding: "0.2rem 0.3rem"
                                            }}
                                        >
                                            +{dayAnimes.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            );

            day = addDays(day, 1);
        }

        return (
            <div className="d-grid" style={{
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.3rem"
            }}>
                {days}
            </div>
        );
    };

    const renderModal = () => {
        if (!selectedDate) return null;

        const formatted = format(selectedDate, "yyyy-MM-dd");
        const matches = filteredAnimeData.filter(item => {
            console.log(`Comparando: ${item.date} com ${formatted}`);
            return item.date === formatted;
        });

        console.log("Itens encontrados:", matches);

        return (
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="lg"
                contentClassName="border-0 overflow-hidden"
            >
                <Modal.Header
                    closeButton
                    closeVariant="white"
                    className="border-0"
                    style={{ background: colors.modalHeader }}
                >
                    <Modal.Title className="text-white" style={{ fontSize: "1.1rem" }}>
                        <i className="bi bi-calendar-event me-2"></i>
                        Lançamentos em {format(selectedDate, "PPPP", { locale: ptBR })}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        background: colors.background,
                        maxHeight: "60vh",
                        overflowY: "auto",
                        padding: "1rem"
                    }}
                >
                    {matches.length === 0 ? (
                        <div className="text-center py-3">
                            <i className="bi bi-calendar-x" style={{
                                fontSize: "2.5rem",
                                color: colors.textMuted
                            }}></i>
                            <p className="mt-2" style={{ color: colors.textMuted }}>
                                Nenhum lançamento para esta data
                            </p>
                        </div>
                    ) : (
                        <div className="row g-2">
                            {matches.map(item => (
                                <motion.div
                                    key={item.mal_id}
                                    className="col-md-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={`rounded-2 p-2 h-100 ${item.type === "anime" ? "border-start border-primary border-3" : "border-start border-warning border-3"}`}
                                        style={{
                                            background: `hsla(240, 15%, 18%, 0.7)`,
                                            color: colors.text
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h6
                                                className="mb-1 fw-bold"
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                {item.title}
                                            </h6>
                                            <Badge
                                                bg={item.type === "anime" ? "primary" : "warning"}
                                                className="text-uppercase"
                                                style={{ fontSize: "0.6rem" }}
                                            >
                                                {item.type}
                                            </Badge>
                                        </div>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {item.genres?.slice(0, 3).map(genre => (
                                                <Badge
                                                    key={genre.mal_id}
                                                    bg="secondary"
                                                    className="text-nowrap"
                                                    style={{ fontSize: "0.6rem" }}
                                                >
                                                    {genre.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="mt-2 d-flex justify-content-between small">
                                            <span style={{ color: colors.textMuted }}>
                                                <i className="bi bi-star-fill text-warning me-1"></i>
                                                {item.score || "N/A"}
                                            </span>
                                            <span style={{ color: colors.textMuted }}>
                                                <i className="bi bi-people-fill text-info me-1"></i>
                                                {item.members?.toLocaleString() || "N/A"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => markItem(item)}
                                            className={`btn btn-sm ${markedItems[item.mal_id] ? 'btn-success' : 'btn-outline-primary'}`}
                                        >
                                            {markedItems[item.mal_id] ? 'Notificação Ativa' : 'Receber Notificação'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer
                    className="border-0"
                    style={{ background: colors.cardBackground }}
                >
                    <Button
                        variant="outline-light"
                        onClick={() => setShowModal(false)}
                        size="sm"
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3 shadow overflow-hidden p-3 w-100"
            style={{
                background: colors.background,
                border: `1px solid ${colors.border}`
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <motion.h2
                    className="h5 mb-0 d-flex align-items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    style={{ color: colors.text }}
                >
                    <i className="bi bi-calendar2-range-fill me-2" style={{ color: colors.primary }}></i>
                    <span style={{ fontSize: "0.95rem" }}>Calendário de Lançamentos</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Form.Select
                        size="sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            background: colors.cardBackground,
                            color: colors.text,
                            borderColor: colors.border,
                            fontSize: "0.8rem"
                        }}
                    >
                        <option value="all">Todos</option>
                        <option value="anime">Animes</option>
                        <option value="manga">Mangás</option>
                    </Form.Select>
                </motion.div>
            </div>

            {renderHeader()}
            {renderDayNames()}
            {renderDays()}
            {renderModal()}
        </motion.section>
    );
};

export default CalendarioInterativo;