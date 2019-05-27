/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GNU GPL v3
 *  See license text at https://opensource.dbc.dk/licenses/gpl-3.0
 */

package dk.dbc.monitoring.errorlog;

import dk.dbc.jsonb.JSONBContext;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.monitoring.errorlog.model.ErrorLogAppView;
import dk.dbc.monitoring.errorlog.model.ErrorLogSummary;
import dk.dbc.monitoring.errorlog.model.QueryParam;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Stateless
@Path("api")
public class ErrorLogService {
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(ErrorLogService.class);
    private final JSONBContext jsonbContext = new JSONBContext();

    @EJB
    ErrorLog errorLog;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("v1/summary")
    public Response getTeamErrors(@DefaultValue("metascrum") @javax.ws.rs.QueryParam("team") String team,
                                  @DefaultValue("1800") @javax.ws.rs.QueryParam("fromSeconds") int fromSeconds) {
        LOGGER.entry();
        String res = "";
        LOGGER.info("Team: {}, from-seconds: {}", team, fromSeconds);
        Instant now = Instant.now();

        QueryParam queryParam = new QueryParam();
        queryParam.withTeam(team);
        queryParam.withFrom(now.minus(fromSeconds, ChronoUnit.SECONDS));
        queryParam.withUntil(now);
        LOGGER.info("Calling getSummary with {}", queryParam);

        List<ErrorLogSummary> summary = errorLog.getSummary(queryParam);

        try {
            res = jsonbContext.marshall(summary);

            return Response.ok(res, MediaType.APPLICATION_JSON).build();
        } catch (JSONBException ex) {
            LOGGER.error("Exception during summary", ex);
            return Response.serverError().build();
        } finally {
            LOGGER.exit(res);
        }
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("v1/appview")
    public Response getAppView(@javax.ws.rs.QueryParam("namespace") String namespace,
                               @javax.ws.rs.QueryParam("app") String app,
                               @javax.ws.rs.QueryParam("team") String team,
                               @javax.ws.rs.QueryParam("fromSeconds") int fromSeconds) {
        LOGGER.entry();
        String res = "";

        try {
            Instant now = Instant.now();

            QueryParam queryParam = new QueryParam();
            queryParam.withNamespace(namespace);
            queryParam.withApp(app);
            queryParam.withTeam(team);
            queryParam.withFrom(now.minus(fromSeconds, ChronoUnit.SECONDS));
            queryParam.withUntil(now);
            LOGGER.info("Calling getAppView with {}", queryParam);

            ErrorLogAppView errorLogAppView = errorLog.getAppView(queryParam);

            res = jsonbContext.marshall(errorLogAppView);

            return Response.ok(res, MediaType.APPLICATION_JSON).build();
        } catch (JSONBException ex) {
            LOGGER.error("Exception during summary", ex);
            return Response.serverError().build();
        } finally {
            LOGGER.exit(res);
        }
    }

}
