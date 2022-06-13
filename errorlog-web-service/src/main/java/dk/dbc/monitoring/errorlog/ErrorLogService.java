package dk.dbc.monitoring.errorlog;

import dk.dbc.jsonb.JSONBContext;
import dk.dbc.jsonb.JSONBException;
import dk.dbc.monitoring.errorlog.model.ErrorLogAppView;
import dk.dbc.monitoring.errorlog.model.ErrorLogSummary;
import dk.dbc.monitoring.errorlog.model.QueryParam;
import org.eclipse.microprofile.metrics.Counter;
import org.eclipse.microprofile.metrics.MetricRegistry;
import org.eclipse.microprofile.metrics.Tag;
import org.eclipse.microprofile.metrics.annotation.RegistryType;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Stateless
@Path("v1")
public class ErrorLogService {
    private static final XLogger LOGGER = XLoggerFactory.getXLogger(ErrorLogService.class);
    private final JSONBContext jsonbContext = new JSONBContext();

    @EJB
    ErrorLog errorLog;

    @Inject
    @RegistryType(type = MetricRegistry.Type.APPLICATION)
    MetricRegistry metricRegistry;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("summary")
    public Response getTeamErrors(@DefaultValue("metascrum") @javax.ws.rs.QueryParam("team") String team,
                                  @DefaultValue("1800") @javax.ws.rs.QueryParam("fromSeconds") int fromSeconds) {
        LOGGER.entry();
        String res = "";

        final Instant now = Instant.now();

        final QueryParam queryParam = new QueryParam();
        queryParam.withTeam(team);
        queryParam.withFrom(now.minus(fromSeconds, ChronoUnit.SECONDS));
        queryParam.withUntil(now);
        LOGGER.info("Calling getSummary with {}", queryParam);

        final List<ErrorLogSummary> summary = errorLog.getSummary(queryParam);

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
    @Path("appview")
    public Response getAppView(@javax.ws.rs.QueryParam("namespace") String namespace,
                               @javax.ws.rs.QueryParam("app") String app,
                               @javax.ws.rs.QueryParam("team") String team,
                               @javax.ws.rs.QueryParam("fromSeconds") int fromSeconds) {
        LOGGER.entry();
        String res = "";

        final Instant now = Instant.now();

        final QueryParam queryParam = new QueryParam();
        queryParam.withNamespace(namespace);
        queryParam.withApp(app);
        queryParam.withTeam(team);
        queryParam.withFrom(now.minus(fromSeconds, ChronoUnit.SECONDS));
        queryParam.withUntil(now);
        LOGGER.info("Calling getAppView with {}", queryParam);

        final ErrorLogAppView errorLogAppView = errorLog.getAppView(queryParam);

        try {
            res = jsonbContext.marshall(errorLogAppView);

            return Response.ok(res, MediaType.APPLICATION_JSON).build();
        } catch (JSONBException ex) {
            LOGGER.error("Exception during summary", ex);
            return Response.serverError().build();
        } finally {
            LOGGER.exit(res);
        }
    }

    @GET
    @Produces({MediaType.TEXT_PLAIN})
    @Path("counters")
    public void getCounters(@Context HttpServletRequest req,
                            @Context HttpServletResponse resp,
                            @javax.ws.rs.QueryParam("team") String team,
                            @javax.ws.rs.QueryParam("fromSeconds") int fromSeconds)
            throws ServletException, IOException {

        final Instant now = Instant.now();
        final QueryParam queryParam = new QueryParam();
        queryParam.withTeam(team);
        queryParam.withFrom(now.minus(fromSeconds, ChronoUnit.SECONDS));
        queryParam.withUntil(now);
        final List<ErrorLogSummary> summaries = errorLog.getSummary(queryParam);
        for (ErrorLogSummary summary : summaries) {
            if (summary.getKind() == ErrorLogSummary.Kind.APP) {
                final Counter counter = metricRegistry.counter("errors",
                        new Tag("namespace", summary.getNamespace()),
                        new Tag("app", summary.getApp()));
                counter.inc(summary.getCount());
            }
        }

        req.getRequestDispatcher("/metrics").forward(req, resp);
    }
}
