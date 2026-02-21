#include "soundmanager.h"
#include <SDL.h>

// 1. Global storage to track which Sample is playing on which Channel
// We use 64 because that's your 'numchannels'
static SoundSample* channel_map[64];

// 2. The Callback: This is called by SDL_mixer automatically when ANY sound ends
void GlobalChannelFinished(int channel) {
    if (channel >= 0 && channel < 64) {
        if (channel_map[channel] != nullptr) {
            channel_map[channel]->OnChannelFinished(); // Tell the sample to -1 its counter
            channel_map[channel] = nullptr;            // Clear the map slot
        }
    }
}

// --- SoundManager Methods ---

bool SoundManager::Initialize(int freq, int channels) {
    if (SDL_InitSubSystem(SDL_INIT_AUDIO) < 0) return false;

    if (Mix_OpenAudio(freq, AUDIO_S16SYS, channels, 1024) < 0) return false;

    Mix_AllocateChannels(numchannels);

    // Initialize our channel map to be empty
    for(int i = 0; i < numchannels; i++) channel_map[i] = nullptr;

    // Register the callback with SDL_mixer
    Mix_ChannelFinished(GlobalChannelFinished);

    samplefreq = freq;
    bytespersample = 4; 
    return true;
}

bool SoundManager::Create(SoundSample*& dest, const char *filename) {
    dest = new SoundSample(filename, samplefreq, bytespersample);
    return dest->initOkay();
}

void SoundManager::playMusic(const char* filename) {
    currentmusic = Mix_LoadMUS(filename);
    Mix_PlayMusic(currentmusic, -1);
}

void SoundManager::setMusicVolume(float volume) {
    Mix_VolumeMusic(volume * MIX_MAX_VOLUME);
}

// --- SoundSample Methods ---

SoundSample::SoundSample(const char *filename, int freq, int bytes) {
    chunk = Mix_LoadWAV(filename);
    samplefreq = freq;
    bytespersample = bytes;
    
    // NEW: Initialize tracking variables
    active_instances = 0;
    last_played_tick = 0;
}

SoundSample::~SoundSample(void) {
    if (chunk) Mix_FreeChunk(chunk);
}

bool SoundSample::initOkay(void) {
    return (chunk != nullptr);
}

float SoundSample::GetSoundLength(void) {
    if(!chunk) return 0;
    return (float)(chunk->alen) / bytespersample / samplefreq * 1000;
}

void SoundSample::Play(float volume, float pan, int limit) {
    if (active_instances >= limit) return;
    if (!chunk) return;

    // --- LIMITER LOGIC ---
    Uint32 current_tick = SDL_GetTicks();

    // Limit 1: Max 3 instances of the SAME sound at once
    if (active_instances >= 3) return;

    // Limit 2: Anti-Spam (Don't let the same sound trigger twice within 50ms)
    // This stops the "machine gun" glitch if a sound is called every frame
    if (current_tick - last_played_tick < 50) return;

    // --- PLAYBACK LOGIC ---
    Mix_VolumeChunk(chunk, volume * MIX_MAX_VOLUME);
    
    int channel = Mix_PlayChannel(-1, chunk, 0);

    // Original logic: if no channels, try to allocate more
    if (channel == -1) {
        Mix_AllocateChannels(8 + Mix_AllocateChannels(-1));
        channel = Mix_PlayChannel(-1, chunk, 0);
    }

    if (channel != -1 && channel < 64) {
        active_instances++;
        last_played_tick = current_tick;
        
        // Link this channel to THIS object so the callback can find us
        channel_map[channel] = this;

        Mix_SetPanning(channel, 127 - (pan * 127), 127 + (pan * 127));
    }
}