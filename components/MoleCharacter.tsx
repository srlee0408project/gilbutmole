/**
 * MoleCharacter - 귀여운 두더지 SVG 캐릭터
 * 등장 시 전체 얼굴, 숨김 시 눈만 살짝
 */

interface MoleCharacterProps {
  visible?: boolean;
  className?: string;
  size?: number;
}

export function MoleCharacter({
  visible = true,
  className = "",
  size = 80,
}: MoleCharacterProps) {
  if (!visible) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        <ellipse cx="32" cy="38" rx="4" ry="3" fill="var(--mole-eye, #1a1a1a)" />
        <ellipse cx="48" cy="38" rx="4" ry="3" fill="var(--mole-eye, #1a1a1a)" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="두더지"
    >
      {/* 얼굴 */}
      <ellipse cx="40" cy="42" rx="32" ry="30" fill="var(--mole-face, #6B4423)" stroke="var(--mole-face-border, #5A3A1E)" strokeWidth="2" />
      {/* 볼터치 */}
      <ellipse cx="26" cy="48" rx="8" ry="6" fill="var(--mole-cheek, #8B5E3C)" opacity="0.8" />
      <ellipse cx="54" cy="48" rx="8" ry="6" fill="var(--mole-cheek, #8B5E3C)" opacity="0.8" />
      {/* 왼쪽 눈 */}
      <ellipse cx="30" cy="36" rx="6" ry="5" fill="var(--mole-eye-white, #F5DEB3)" />
      <ellipse cx="30" cy="36" rx="3" ry="3" fill="var(--mole-eye, #1a1a1a)" />
      <circle cx="31" cy="35" r="1" fill="white" opacity="0.9" />
      {/* 오른쪽 눈 */}
      <ellipse cx="50" cy="36" rx="6" ry="5" fill="var(--mole-eye-white, #F5DEB3)" />
      <ellipse cx="50" cy="36" rx="3" ry="3" fill="var(--mole-eye, #1a1a1a)" />
      <circle cx="51" cy="35" r="1" fill="white" opacity="0.9" />
      {/* 코 */}
      <ellipse cx="40" cy="48" rx="10" ry="9" fill="var(--mole-nose, #4A2C14)" />
      <ellipse cx="40" cy="47" rx="5" ry="4" fill="var(--mole-nose-shine, #5A3A1E)" opacity="0.6" />
    </svg>
  );
}
