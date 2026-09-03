import crypto from 'node:crypto';
import { PermissionFlagsBits } from 'discord.js';
import { env } from '../../config/env.js';
import { hasMinimumRank } from '../../services/permissionService.js';

export function csrfToken(req, res, next) {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

export function verifyCsrf(req, res, next) {
  const received = String(req.body?._csrf || '');
  const expected = String(req.session?.csrfToken || '');
  if (!received || !expected || received.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))) {
    return res.status(403).render('forbidden', { message: 'The form security token was invalid. Reload the page and try again.' });
  }
  next();
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated?.()) return next();
  return res.redirect('/auth/discord');
}

export function ensureGuildAccess(client, minimumRank = 'Corporal') {
  return async (req, res, next) => {
    try {
      const guild = await client.guilds.fetch(env.DISCORD_GUILD_ID);
      const member = await guild.members.fetch(req.user.id).catch(() => null);
      if (!member) return res.status(403).render('forbidden', { message: 'You are not a member of the configured LCSO Discord server.' });
      if (!await hasMinimumRank(member, minimumRank)) return res.status(403).render('forbidden', { message: `Dashboard access requires ${minimumRank} or higher.` });
      req.discordGuild = guild;
      req.discordMember = member;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function ensureWebRank(minimumRank) {
  return async (req, res, next) => {
    if (!req.discordMember) return res.status(403).render('forbidden', { message: 'Discord membership could not be verified.' });
    if (await hasMinimumRank(req.discordMember, minimumRank)) return next();
    return res.status(403).render('forbidden', { message: `This action requires ${minimumRank} or higher.` });
  };
}

export function ensureWebAdmin(req, res, next) {
  if (req.discordMember?.permissions.has(PermissionFlagsBits.Administrator)) return next();
  return res.status(403).render('forbidden', { message: 'Discord Administrator permission is required for this action.' });
}
