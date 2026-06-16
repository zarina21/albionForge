import { CURRENT_PATCH_VERSION, OUTDATED_DAYS_THRESHOLD } from "./config";

interface BuildOutdatedCheck {
  status: string;
  lastVerifiedAt: Date | null;
  patchVersion: string | null;
}

export function isBuildOutdated(build: BuildOutdatedCheck): boolean {
  if (build.status === "outdated") return true;
  if (build.lastVerifiedAt === null) return true;

  const daysSinceVerification = (Date.now() - new Date(build.lastVerifiedAt).getTime()) / 86400000;
  if (daysSinceVerification > OUTDATED_DAYS_THRESHOLD) return true;

  if (build.patchVersion !== CURRENT_PATCH_VERSION) return true;

  return false;
}

export function getOutdatedReason(build: BuildOutdatedCheck): string {
  if (build.status === "outdated") return "Build status is set to outdated";
  if (build.lastVerifiedAt === null) return "Build has never been verified";
  const daysSinceVerification = Math.floor(
    (Date.now() - new Date(build.lastVerifiedAt).getTime()) / 86400000,
  );
  if (daysSinceVerification > OUTDATED_DAYS_THRESHOLD) {
    return `Last verified ${daysSinceVerification} days ago (threshold: ${OUTDATED_DAYS_THRESHOLD} days)`;
  }
  if (build.patchVersion !== CURRENT_PATCH_VERSION) {
    return `Build patch "${build.patchVersion}" does not match current patch "${CURRENT_PATCH_VERSION}"`;
  }
  return "Unknown";
}
