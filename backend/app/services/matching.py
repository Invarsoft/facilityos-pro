from app.models.user import User


class WorkerMatcher:
    """
    Port of the frontend "Facos Match" heuristic — now server-side so
    assignment recommendations are consistent and auditable.

    Score components (weights):
      - skill coverage vs ticket category   40%
      - availability + active load          25%
      - historical completion volume        20%
      - verification rating                 15%
    """

    W_SKILL = 0.40
    W_LOAD = 0.25
    W_HISTORY = 0.20
    W_RATING = 0.15

    @classmethod
    def score(cls, worker: User, category: str) -> tuple[float, list[str]]:
        reasons: list[str] = []
        score = 0.0

        # 1) skills
        skills = worker.skills or []
        if category in skills:
            score += cls.W_SKILL
            reasons.append(f"Specialises in {category}")
        elif any(category in s or s in category for s in skills):
            score += cls.W_SKILL * 0.5
            reasons.append(f"Related skill: {skills[0] if skills else 'generalist'}")
        else:
            reasons.append("Generalist (no exact skill match)")

        # 2) capacity
        load = worker.active_load or 0
        if not worker.is_available:
            return 0.0, ["Currently unavailable"]
        if load == 0:
            score += cls.W_LOAD
            reasons.append("Fully available (no open jobs)")
        elif load <= 3:
            score += cls.W_LOAD * 0.6
            reasons.append(f"Light load ({load} open)")
        else:
            score += cls.W_LOAD * 0.2
            reasons.append(f"Heavy load ({load} open)")

        # 3) history
        completed = min(worker.completed_jobs or 0, 50)
        score += cls.W_HISTORY * (completed / 50)
        if completed >= 20:
            reasons.append(f"{completed} jobs completed")

        # 4) rating
        rating = worker.rating or 5.0
        score += cls.W_RATING * ((rating - 3.0) / 2.0)  # maps 3..5 -> 0..1
        if rating >= 4.5:
            reasons.append(f"Top rated ({rating:.1f})")

        return round(score, 4), reasons

    @classmethod
    def rank(cls, workers: list[User], category: str, limit: int = 5) -> list[dict]:
        ranked = []
        for w in workers:
            s, reasons = cls.score(w, category)
            if s <= 0:
                continue
            ranked.append(
                {
                    "worker": w,
                    "match_score": s,
                    "reasons": reasons,
                }
            )
        ranked.sort(key=lambda r: r["match_score"], reverse=True)
        return ranked[:limit]
