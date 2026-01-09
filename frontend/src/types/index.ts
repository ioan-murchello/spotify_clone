export interface iSong {
    _id: string,
    title: string,
    artist: string,
    albumId: string | null,
    imageUrl: string,
    audioUrl: string,
    duration: number,
    createdAt: string,
    updatedAt: string,
}

export interface iAlbum {
    _id: string,
    title: string,
    artist: string,
    imageUrl: string,
    releaseYear: number,
    songs: iSong[],
}

export interface iStats {
    totalSongs: number,
    totalAlbums: number,
    totalUsers: number,
    totalArtists: number,
}

export interface iMessages {
    _id: string,
    senderId: string,
    receiverId: string,
    content: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface iUser {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}