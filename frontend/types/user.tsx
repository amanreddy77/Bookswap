export type Username = string;
export type Email = string;
export type Name = string;
export type Gender = 
    | "M"
    | "F"
    | "-";

export type Interest = string;

export type User = {
    id?: string; // Optional ID from backend
  name: Name; // Combined firstName and lastName into name
  mobile: string; // Matches backend
  email: Email; // Matches backend
  password: string; // Matches backend
  role: 'owner' | 'seeker'; // Matches backend
    username: Username,
    firstName: Name,
    lastName: Name,
    gender?: Gender,
    interests?: Interest[],
    lookingFor?: Interest[],
    profile?: string
    booksListed?: Record<string, string>  
    // booksExchanged?: Record<string, string>
    // booksLiked?: Record<string, string>
}