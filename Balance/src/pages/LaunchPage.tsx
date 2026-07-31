import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import { MotionWordmark } from "../components/motion/MotionWordmark";
import { motionTokens } from "../motion/motionTokens";

export function LaunchPage() {
	const navigate = useNavigate();
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		const timer = window.setTimeout(
			() => {
				navigate("/welcome", { replace: true });
			},
			reduceMotion ? 120 : 1200,
		);

		return () => window.clearTimeout(timer);
	}, [navigate, reduceMotion]);

	return (
		<motion.main
			className="entry-screen launch-screen"
			aria-label="ARQ Balance завантажується"
			initial={reduceMotion ? { opacity: 0 } : { opacity: 0.94, filter: "brightness(.92)" }}
			animate={{ opacity: 1, filter: "brightness(1)" }}
			transition={reduceMotion ? { duration: 0.12 } : motionTokens.spring.screen}
		>
			<MotionWordmark
				className="launch-mark"
				initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
				animate={{ opacity: 1, scale: 1 }}
			/>

			<div className="launch-progress" aria-hidden="true">
				<div className="launch-progress__track">
					<motion.span
						className="launch-progress__value"
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={reduceMotion ? { duration: 0.1 } : { ...motionTokens.spring.screen, visualDuration: motionTokens.duration.splash }}
					/>
				</div>
			</div>
		</motion.main>
	);
}
