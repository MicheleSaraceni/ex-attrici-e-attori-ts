type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese",
}

const nationalityArray: string[] = ["American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese"]



const API_URL = "http://localhost:3333";

async function getActress(id: number): Promise<Actress | null> {
  try {
    const res = await fetch(`${API_URL}/actresses/:${id}`);
    const dati: unknown = await res.json();
    if (!isActress(dati)) {
      throw new Error("Dati non validi")
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
    return null
  }
}



function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === "object" &&
    dati !== null &&
    "id" in dati &&
    typeof dati.id === "number" &&
    "name" in dati &&
    typeof dati.name === "string" &&
    "birth_year" in dati &&
    typeof dati.birth_year === "number" &&
    "death_year" in dati &&
    typeof dati.death_year === "number" &&
    "biography" in dati &&
    typeof dati.biography === "string" &&
    "image" in dati &&
    typeof dati.image === "string" &&
    "most_famous_movies" in dati &&
    Array.isArray(dati.most_famous_movies) &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every((film => typeof film === "string")) &&
    "awards" in dati &&
    typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof dati.nationality === "string" &&
    nationalityArray.includes(dati.nationality)
  )
}



async function getAllActresses(): Promise<Actress[]> {
  try {
    const res = await fetch(`${API_URL}/actresses/`);
    if (!res.ok) {
      throw new Error("Risposta chiamata non andata a buon fine")
    }
    const dati: unknown = await res.json();

    if (!(dati instanceof Array)) {
      throw new Error("Dati non validi")
    }
    const actresses: Actress[] = dati.filter(act => isActress(act))
    return actresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
    return [];
  }
}



async function getActresses(idActress: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = idActress.map(id => getActress(id))
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
    return [];
  }
} 