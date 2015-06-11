package models;

import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * User: grant.mills
 * Date: 8/20/14
 * Time: 1:53 PM
 */
@Entity
public class Referral extends Model implements HistoryRecord {
	public static final int MILLISECONDS_IN_A_DAY = 86400000;
	@Id
    public long id;

    public long creatorId;
	public long clientId;
	public String clientName;
	public String refType;
	public String status = "OPEN";
	public Integer tInsurance = 0;
	public Integer tPc = 0;
	public Integer tIps = 0;

	@Transient
	public String link;

    public long user_id;

    public Long dateCreated = System.currentTimeMillis();
	public String nextStepDate;
	public String lastEditedDate;

    public String reasonForReferral;
    public String refNotes;
    public Boolean wasProductive = false;


    public static Model.Finder<Long, Referral> finder = new Model.Finder(Long.class, Referral.class);
    public static Referral getById(Long id) {
        return finder.byId(id);
    }
    public static List<Referral> getAll() {
        return finder.all();
    }
    public static List<Referral> getRecentByCreatorId(Long id) {
		int MAX_RECENT_REFERRALS = 25;
        return finder.where().eq("creatorId", id).orderBy("date_created DESC").setMaxRows(MAX_RECENT_REFERRALS).findList();
    }
    public static List<Referral> getByCreatorId(Long id) {
		int MAX_RECENT_REFERRALS = 25;
        return finder.where().eq("creatorId", id).orderBy("id").setMaxRows(MAX_RECENT_REFERRALS).findList();
    }
	public static List<Referral> getByAssignedIdInRange(Long assigneeId, Long range) {
		return finder.where().eq("user_id", assigneeId).ge("dateCreated", range).findList();
	}
	public static List<Referral> getByUserId(Long assignedUserId) {
		return finder.where().eq("user_id", assignedUserId).findList();
	}
	public static List<Referral> getByClientId(Long id) {
		return finder.where().eq("clientId", id).findList();
	}
	public static List<Referral> getByDate(Date date) {
		//If referral is from that date
		Long endOfDay = date.getTime() + MILLISECONDS_IN_A_DAY;
		return finder.where().between("date_created", date.getTime(), endOfDay).findList();
	}

	@Override
	public Long getDateOfLastInteraction() {
		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
		Date d = null;
		try {
			d = f.parse(this.lastEditedDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return d.getTime();
	}

	@Override
	public String getDateOfLastInteractionString() {
		return this.lastEditedDate;
	}

	@Override
	public String getRecordType() {
		return "Referral";
	}

	@Override
	public int compareTo(HistoryRecord historyRecord) {
		if (historyRecord.getDateOfLastInteraction() > this.getDateOfLastInteraction()) {
			return 1;
		} else if (historyRecord.getDateOfLastInteraction() < this.getDateOfLastInteraction()) {
			return -1;
		}
		return 0;
	}

	@Override
	public String getRecordStatus() {
		return this.status;
	}

	@Override
	public String getNotes() {
		return this.refNotes;
	}

	public void setLink(String link) {
		this.link = link;
	}

	@Override
	public String getLink() {
		return link;
	}
}
