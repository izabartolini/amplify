import { useRef, useState } from "react";
import { TextInput, Group } from "@mantine/core";

export default function VerificationCode({ onComplete }) {
    const [localCode, setLocalCode] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        // Colagem
        if (value.length > 1) {
            const values = value.replace(/\D/g, "").slice(0, 6).split("");

            const newCode = [...localCode];

            values.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });

            setLocalCode(newCode);

            const next = Math.min(index + values.length, 5);
            inputsRef.current[next]?.focus();

            if (newCode.every((d) => d !== "")) {
                onComplete(newCode.join(""));
            }

            return;
        }

        const newCode = [...localCode];
        newCode[index] = value;

        setLocalCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newCode.every((d) => d !== "")) {
            onComplete(newCode.join(""));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (localCode[index] === "" && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    return (
        <Group justify="center" gap="md">
            {localCode.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={6}
                    styles={{
                        input: {
                            width: 45,
                            height: 50,
                            textAlign: "center",
                            fontSize: "24px",
                            fontWeight: "bold",
                        },
                    }}
                />
            ))}
        </Group>
    );
}