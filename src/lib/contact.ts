export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  website?: string;
};
export function validateContact(value: unknown): ContactMessage | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    typeof data.message !== "string"
  )
    return null;
  const name = data.name.trim(),
    email = data.email.trim(),
    message = data.message.trim();
  if (
    !name ||
    name.length > 80 ||
    /[\r\n]/.test(name) ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length < 10 ||
    message.length > 5000
  )
    return null;
  if (data.website !== undefined && typeof data.website !== "string")
    return null;
  return {
    name,
    email,
    message,
    website: typeof data.website === "string" ? data.website : "",
  };
}
