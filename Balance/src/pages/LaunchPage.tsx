import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArqWordmark } from "../components/brand/ArqWordmark";

export function LaunchPage() {
	const navigate = useNavigate();

	useEffect(() => {
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const timer = window.setTimeout(
			() => {
				navigate("/welcome", { replace: true });
			},
			reduceMotion ? 500 : 2200,
		);

		return () => window.clearTimeout(timer);
	}, [navigate]);

	return (
		<main
			className="entry-screen launch-screen"
			aria-label="ARQ Balance завантажується"
		>
			<div className="launch-mark">
				<ArqWordmark />
			</div>

			<div className="launch-progress" aria-hidden="true">
				<div className="launch-progress__track">
					<span className="launch-progress__value" />
				</div>
				<p>Завантаження</p>
			</div>
		</main>
	);
}
